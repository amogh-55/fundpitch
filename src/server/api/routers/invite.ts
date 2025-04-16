import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  companyInvites,
  companyUser,
  individualUser,
  usersTable,
  otpMessages,
} from "@/server/db/schema";
import { eq, and, or, ne } from "drizzle-orm";
import { inviteEmail, createPhoneInvite } from "@/lib/company-invite-user";
import {
  inviteEmail as individualInviteEmail,
  createPhoneInvite as individualCreatePhoneInvite,
} from "@/lib/individual-invite";
import { db } from "@/server/db";
import { lucia } from "@/server/auth";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import emailTransport from "@/server/email-transport";
export const inviteRouter = createTRPCRouter({
  createEmailIndividualInvite: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        role: z.string(),
        baseUrl: z.string(),
        name: z.string(),
        companyName: z.string(),
        location: z.string(),
        sector: z.string(),
        companyUserId: z.string(),
        parentInviteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const {
        email,
        role,
        baseUrl,
        companyUserId,
        parentInviteId,
        name,
        companyName,
        location,
        sector,
      } = input;
      const user = ctx.user;

      console.log({ email, role, baseUrl, companyUserId, parentInviteId });

      if (!user) {
        throw new Error("User not found");
      }

      const userCreds = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, user.id),
      });

      if (userCreds?.email === email) {
        throw new Error("You cannot invite yourself");
      }

      const parentInvite = await db.query.companyInvites.findFirst({
        where: and(
          eq(companyInvites.inviteId, parentInviteId),
          eq(companyInvites.status, "accepted"),
          eq(companyInvites.isUserApproved, true),
        ),
      });

      if (!parentInvite) {
        throw new Error(
          "Invalid parent invite or not authorized to invite others",
        );
      }

      const newInviteLevel = (parentInvite.inviteLevel ?? 0) + 1;

      return await individualInviteEmail({
        email,
        role,
        companyUserId,
        inviterId: user.id,
        parentInviteId,
        isDirectCompanyInvite: false,
        inviteLevel: newInviteLevel,
        baseUrl,
        name: name ?? "",
        companyName: companyName ?? "",
        location: location ?? "",
        sector: sector ?? "",
      });
    }),

  getInvite: publicProcedure
    .input(
      z.object({
        inviteId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { inviteId } = input;

      const invite = await db
        .select({
          id: companyInvites.id,
          inviteId: companyInvites.inviteId,
          email: companyInvites.email,
          phone: companyInvites.phoneNumber,
          role: companyInvites.role,
          status: companyInvites.status,
          companyName: companyUser.companyName,
          photo: companyUser.photo,
          about: companyUser.about,
        })
        .from(companyInvites)
        .leftJoin(
          companyUser,
          eq(companyInvites.companyUserId, companyUser.userId),
        )
        .where(
          and(
            eq(companyInvites.inviteId, inviteId),
            ne(companyInvites.status, "declined"),
            ne(companyInvites.status, "accepted"),
          ),
        )
        .execute();

      if (!invite?.[0]) {
        throw new Error("Invite not found");
      }

      return invite[0];
    }),

  declineInvite: publicProcedure
    .input(z.object({ inviteId: z.string() }))
    .mutation(async ({ input }) => {
      const { inviteId } = input;

      await db
        .update(companyInvites)
        .set({
          status: "declined",
        })
        .where(eq(companyInvites.inviteId, inviteId))
        .execute();

      return {
        success: true,
        message: "Invite declined successfully",
      };
    }),

  sendPhoneOtp: publicProcedure
    .input(z.object({ phone: z.string() }))
    .mutation(async ({ input }) => {
      const otp =
        process.env.NODE_ENV === "development"
          ? 1234
          : Math.floor(1000 + Math.random() * 9000);

      try {
        if (process.env.NODE_ENV === "development") {
          await db.insert(otpMessages).values({
            phone: input.phone,
            otp: otp,
            expireAt: new Date(Date.now() + 10 * 60 * 1000),
          });
        } else {
          // In production, send SMS and store OTP
          const apiEndpoint = "https://msgn.mtalkz.com/api";
          const message = `${otp} is your verification code EQUIPPP`;
          const payload = {
            apikey: process.env.MTALKZ_API_KEY,
            senderid: "EQUPPP",
            number: input.phone,
            message: message,
            format: "json",
          };

          const [result] = await Promise.all([
            axios.post(apiEndpoint, payload),
            db.insert(otpMessages).values({
              phone: input.phone,
              otp: otp,
              expireAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
            }),
          ]);

          console.log({ result });
        }
      } catch (error) {
        console.log({ error });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send OTP SMS",
        });
      }
    }),

  sendEmailOtp: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      // Generate OTP
      const otp =
        process.env.NODE_ENV === "development"
          ? 1234
          : Math.floor(1000 + Math.random() * 9000);

      // Prepare email
      const mailOptions = {
        from: "info@fundpitch.com",
        to: input.email,
        subject: "Email Verification OTP",
        text: `Your OTP for email verification is: ${otp}`,
      };

      try {
        // In development, skip email sending
        if (process.env.NODE_ENV === "development") {
          await db.insert(otpMessages).values({
            email: input.email,
            otp: otp,
            expireAt: new Date(Date.now() + 10 * 60 * 1000),
          });
          return;
        }

        // In production, send email and store OTP
        await Promise.all([
          emailTransport.sendMail(mailOptions),
          db.insert(otpMessages).values({
            email: input.email,
            otp: otp,
            expireAt: new Date(Date.now() + 10 * 60 * 1000),
          }),
        ]);
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send OTP email",
        });
      }
    }),

  checkExistingMembership: publicProcedure
    .input(z.object({ inviteId: z.string() }))
    .query(async ({ ctx, input }) => {
      // First get the invite details
      const invite = await db.query.companyInvites.findFirst({
        where: eq(companyInvites.inviteId, input.inviteId),
      });

      console.log({ invite });

      if (!invite) {
        throw new Error("Invite not found");
      }

      // Check if there's an existing user with the same email or phone
      const existingUser = await db.query.usersTable.findFirst({
        where: or(
          invite.email ? eq(usersTable.email, invite.email) : undefined,
          invite.phoneNumber
            ? eq(usersTable.phone, invite.phoneNumber)
            : undefined,
        ),
      });

      console.log({ existingUser });

      if (!existingUser) {
        return { exists: false };
      }

      // Check if the user is already part of this company
      const existingMembership = await db.query.companyInvites.findFirst({
        where: and(
          eq(companyInvites.companyUserId, invite.companyUserId),
          or(
            eq(companyInvites.email, existingUser.email ?? ""),
            eq(companyInvites.phoneNumber, existingUser.phone ?? ""),
          ),
          eq(companyInvites.status, "accepted"),
          eq(companyInvites.isUserApproved, true),
        ),
      });

      return {
        exists: !!existingMembership,
      };
    }),

  verifyAcceptInvite: publicProcedure
    .input(
      z.object({
        inviteId: z.string(),
        phone: z.string().optional(),
        email: z.string().optional(),
        role: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { inviteId, phone, email, role: userType } = input;

      const inviteAndUser = await db.transaction(async (tx) => {
        const [invite, existingUser] = await Promise.all([
          tx
            .select()
            .from(companyInvites)
            .where(eq(companyInvites.inviteId, inviteId))
            .limit(1),

          tx
            .select({
              id: usersTable.id,
              phone: usersTable.phone,
              email: usersTable.email,
            })
            .from(usersTable)
            .where(
              or(
                email ? eq(usersTable.email, email) : undefined,
                phone ? eq(usersTable.phone, phone) : undefined,
              ),
            )
            .limit(1),
        ]);

        if (!invite?.[0]) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invite not found",
          });
        }

        let user = existingUser?.[0];

        if (user) {
          const existingMembership = await tx
            .select()
            .from(companyInvites)
            .where(
              and(
                eq(companyInvites.companyUserId, invite[0].companyUserId),
                or(
                  eq(companyInvites.email, user.email ?? ""),
                  eq(companyInvites.phoneNumber, user.phone ?? ""),
                ),
              ),
            )
            .limit(1);

          await tx
            .update(companyInvites)
            .set({ status: "accepted" })
            .where(eq(companyInvites.inviteId, inviteId));

          // Create session

          return {
            user,
            invite: invite[0],
            isExistingMember: !!existingMembership?.[0],
          };
        } else {
          const [newUser] = await tx
            .insert(usersTable)
            .values({
              phone,
              email,
              userType,
            })
            .returning();

          if (!newUser) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to create user",
            });
          }

          user = newUser;

          await Promise.all([
            tx.insert(individualUser).values({
              userId: user.id,
              email,
              contactNumber: phone,
            }),

            tx
              .update(companyInvites)
              .set({
                status: "accepted",
              })
              .where(eq(companyInvites.inviteId, inviteId)),
          ]);

          return {
            user,
            invite: invite[0],
            isExistingMember: false,
          };
        }
      });

      const session = await lucia.createSession(inviteAndUser.user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return {
        success: true,
        isExistingMember: inviteAndUser.isExistingMember,
        user: inviteAndUser.user,
        invite: inviteAndUser.invite,
      };
    }),

  createWhatsAppInvite: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        role: z.string(),
        baseUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { phoneNumber, role, baseUrl } = input;
      const user = ctx.user;

      if (!user) {
        throw new Error("User not found");
      }

      const userCreds = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, user.id),
      });

      if (userCreds?.phone === phoneNumber) {
        throw new Error("You cannot invite yourself");
      }

      const company = await db.query.companyUser.findFirst({
        where: eq(companyUser.userId, user.id),
      });

      if (!company) {
        throw new Error("Company not found");
      }

      return await createPhoneInvite({
        phoneNumber,
        role,
        baseUrl,
        companyName: company.companyName ?? "",
        founderName: company.founderName ?? "",
        companyUserId: user.id,
        inviterId: user.id,
        isDirectCompanyInvite: true,
        inviteLevel: 0,
      });
    }),

  createWhatsAppIndividualInvite: protectedProcedure
    .input(
      z.object({
        phoneNumber: z.string(),
        role: z.string(),
        baseUrl: z.string(),
        companyUserId: z.string(),
        parentInviteId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { phoneNumber, role, companyUserId, parentInviteId } = input;
      const user = ctx.user;

      const userCreds = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, user?.id),
      });

      if (userCreds?.phone === phoneNumber) {
        throw new Error("You cannot invite yourself");
      }

      const userName = await db.query.individualUser.findFirst({
        where: eq(individualUser.userId, user.id),
      });

      if (!user) {
        throw new Error("User not found");
      }

      const parentInvite = await db.query.companyInvites.findFirst({
        where: and(
          eq(companyInvites.inviteId, parentInviteId),
          eq(companyInvites.status, "accepted"),
          eq(companyInvites.isUserApproved, true),
        ),
      });

      const company = await db.query.companyUser.findFirst({
        where: eq(companyUser.userId, parentInvite?.companyUserId ?? ""),
      });

      if (!parentInvite) {
        throw new Error(
          "Invalid parent invite or not authorized to invite others",
        );
      }

      const newInviteLevel = (parentInvite.inviteLevel ?? 0) + 1;

      return await individualCreatePhoneInvite({
        phoneNumber,
        role,
        companyUserId,
        inviterId: user.id,
        parentInviteId,
        isDirectCompanyInvite: false,
        inviteLevel: newInviteLevel,
        founderName: userName?.name ?? "",
        companyName: company?.companyName ?? "",
      });
    }),

  createEmailInvite: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
        role: z.string(),
        baseUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { email, role, baseUrl } = input;
      const user = ctx.user;

      if (!user) {
        throw new Error("User not found");
      }

      const userCreds = await db.query.usersTable.findFirst({
        where: eq(usersTable.id, user?.id),
      });

      if (userCreds?.email === email) {
        throw new Error("You cannot invite yourself");
      }

      const company = await db.query.companyUser.findFirst({
        where: eq(companyUser.userId, user.id),
      });

      if (!company) {
        throw new Error("Company not found");
      }

      return await inviteEmail({
        email,
        role,
        companyName: company.companyName ?? "",
        founderName: company.founderName ?? "",
        location: company.companyAddress ?? "",
        sector: company.sectors ?? "",
        companyUserId: user.id,
        inviterId: user.id,
        isDirectCompanyInvite: true,
        inviteLevel: 0,
        baseUrl,
      });
    }),
});

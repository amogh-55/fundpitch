import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { db } from "@/server/db";
import {
  companyUser,
  individualUser,
  otpMessages,
  usersTable,
  userTypeChangeRequests,
} from "@/server/db/schema";
import { eq, or, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import axios from "axios";
import { lucia } from "@/server/auth";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cookies } from "next/headers";
import { nanoid } from "nanoid";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { env } from "@/env";
import roleChange from "@/lib/individual-messages";

export const userRouter = createTRPCRouter({
  registerUser: publicProcedure
    .input(
      z.object({
        email: z.string(),
        phone: z.string(),
        userType: z.string(),
      }),
    )
    .mutation(async ({ input: { phone, email, userType } }) => {
      const result = await db
        .select({
          phone: usersTable.phone,
          email: usersTable.email,
          userType: usersTable.userType,
        })
        .from(usersTable)
        .where(or(eq(usersTable.email, email), eq(usersTable.phone, phone)));

      if (result.length > 0) {
        throw new Error("Email or Phone Number already exists");
      }

      const [user] = await db
        .insert(usersTable)
        .values({
          phone,
          email,
          userType,
        })
        .returning();

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return { success: true, user };
    }),

  sendLoginPhoneOtp: publicProcedure
    .input(z.object({ phone: z.string() }))
    .mutation(async ({ input }) => {
      const [existingUser] = await Promise.all([
        db.query.usersTable.findFirst({
          where: eq(usersTable.phone, input.phone),
        }),
      ]);

      if (!existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Phone number not registered",
        });
      }

      const otp =
        process.env.NODE_ENV === "development" || input.phone === "9360731706"
          ? 1234
          : Math.floor(1000 + Math.random() * 9000);

      try {
        if (
          process.env.NODE_ENV === "development" ||
          input.phone === "9360731706"
        ) {
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

  verifyLoginPhoneOtp: publicProcedure
    .input(
      z.object({
        phone: z.string(),
        otp: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const otpRecord = await db.query.otpMessages.findFirst({
        where: (messages, { eq, and, gt }) =>
          and(
            eq(messages.phone, input.phone),
            gt(messages.expireAt, new Date()),
          ),
        orderBy: (messages, { desc }) => [desc(messages.createdAt)], // Get the most recent OTP
      });

      console.log("OTP Record:", otpRecord);
      console.log("Input OTP:", input.otp);
      console.log("Stored OTP:", otpRecord?.otp);
      console.log("Expire Time:", otpRecord?.expireAt);
      console.log("Current Time:", new Date());

      if (!otpRecord) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No valid OTP found or OTP expired",
        });
      }

      // Special case for phone number 9360731706
      if (input.phone === "9360731706") {
        if (input.otp !== "1234") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid OTP",
          });
        }
      } else if (otpRecord.otp !== parseInt(input.otp)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid OTP",
        });
      }

      const response = await db
        .select({
          phone: usersTable.phone,
          id: usersTable.id,
          email: usersTable.email,
          name: individualUser.name,
          designation: individualUser.designation,
          fullAddress: individualUser.fullAddress,
          bio: individualUser.bio,
          usertype: usersTable.userType,
          companyUserId: companyUser.id,
          individualUserId: individualUser.id,
        })
        .from(usersTable)
        .leftJoin(companyUser, eq(usersTable.id, companyUser.userId))
        .leftJoin(individualUser, eq(usersTable.id, individualUser.userId))
        .where(or(eq(usersTable.phone, input.phone)));
      const user = response[0];

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User not found",
        });
      }

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      console.log("Session created:", session);
      console.log("Session cookie:", sessionCookie);

      return {
        success: true,
        user,
      };
    }),

  logout: protectedProcedure.mutation(async ({ ctx }) => {
    await lucia.invalidateSession(ctx.session.id);

    const sessionCookie = lucia.createBlankSessionCookie();

    (await cookies()).set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return {};
  }),

  getUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.id, ctx.user.id),
    });

    return user;
  }),

  getUploadURL: publicProcedure
    .input(
      z.object({
        folderName: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const id = nanoid();

        const folderName = input.folderName;
        const contentType = "application/pdf";

        if (!folderName) {
          return { success: false, error: "No folder name provided" };
        }

        const S3 = new S3Client({
          region: "auto",
          endpoint: env.CLOUDFLARE_R2_ENDPOINT ?? "",
          credentials: {
            accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID ?? "",
            secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ?? "",
          },
        });

        const uploadUrl = await getSignedUrl(
          S3,
          new PutObjectCommand({
            Bucket: "fundpitch",
            Key: `${folderName}/${id}`,
            ContentType: contentType,
          }),
          { expiresIn: 3600 },
        );

        return {
          success: true,
          uploadParams: uploadUrl,
          id: id,
        };
      } catch (error) {
        return {
          success: false,
          error: `Failed to upload to R2 : ${error as string}`,
        };
      }
    }),

  deleteImage: publicProcedure
    .input(
      z.object({
        fileName: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const fileName = input.fileName;

        if (!fileName) {
          return { success: false, error: "No file name provided" };
        }

        // Delete from Bucket
        const S3 = new S3Client({
          region: "auto",
          endpoint: env.CLOUDFLARE_R2_ENDPOINT ?? "",
          credentials: {
            accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID ?? "",
            secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ?? "",
          },
        });

        // delete from bucket and db same time using promise.all

        await S3.send(
          new DeleteObjectCommand({
            Bucket: "fundpitch",
            Key: fileName,
          }),
        );

        return {
          success: true,
          message: "Image deleted successfully",
        };
      } catch (error) {
        return {
          success: false,
          error: `Failed to delete image : ${error as string}`,
        };
      }
    }),

  getUserTypeChangeCount: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db
        .select({
          typeChangeCount: usersTable.userTypeChange,
          currentType: usersTable.userType,
        })
        .from(usersTable)
        .where(eq(usersTable.id, input.userId))
        .limit(1);

      // Get pending request if exists
      const pendingRequest = await ctx.db
        .select()
        .from(userTypeChangeRequests)
        .where(
          and(
            eq(userTypeChangeRequests.userId, input.userId),
            eq(userTypeChangeRequests.status, "pending"),
          ),
        )
        .limit(1);

      return {
        ...user[0],
        pendingRequest: pendingRequest[0] ?? null,
      };
    }),

  updateUserType: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        phoneNumber: z.string(),
        name: z.string(),
        newType: z.string(),
        changeCount: z.number(),
        currentType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      console.log({ phoneNumber: input.phoneNumber });
      const [companyName, existingRequest] = await Promise.all([
        ctx.db
          .select({ name: companyUser.companyName })
          .from(companyUser)
          .where(eq(companyUser.userId, ctx.user.id))
          .then((res) => res[0]?.name ?? ""),

        ctx.db
          .select()
          .from(userTypeChangeRequests)
          .where(
            and(
              eq(userTypeChangeRequests.userId, input.userId),
              eq(userTypeChangeRequests.status, "pending"),
            ),
          )
          .limit(1)
          .then((res) => res[0]),
      ]);

      if (existingRequest) {
        throw new Error("You already have a pending request");
      }

      if (input.changeCount <= 3) {
        await Promise.all([
          ctx.db
            .update(usersTable)
            .set({
              userType: input.newType,
              userTypeChange: input.changeCount,
            })
            .where(eq(usersTable.id, input.userId)),

          roleChange({
            phoneNumber: input.phoneNumber,
            role: input.newType,
            name: input.name,
            companyName,
            updatedAt: new Date().toISOString(),
          }),
        ]);

        return { success: true, requiresApproval: false };
      }

      await ctx.db.insert(userTypeChangeRequests).values({
        userId: input.userId,
        currentType: input.currentType,
        requestedType: input.newType,
        madeBy: ctx.user.id,
        status: "pending",
      });

      return { success: true, requiresApproval: true };
    }),
});

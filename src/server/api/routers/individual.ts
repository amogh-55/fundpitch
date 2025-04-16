import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  companyUser,
  individualUser,
  companyInvites,
  usersTable,
  companyExpress,
  companyEndorse,
  individualDocuments,
} from "@/server/db/schema";
import { eq, and, or, desc, isNotNull, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const individualRouter = createTRPCRouter({
  updateProfilePhoto: protectedProcedure
    .input(
      z.object({
        photo: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      const individual = await ctx.db
        .select({
          id: individualUser.userId,
        })
        .from(individualUser)
        .where(eq(individualUser.userId, user.id))
        .execute();

      if (individual.length === 0) {
        await ctx.db
          .insert(individualUser)
          .values({
            userId: user.id,
            photo: input.photo ?? null,
          })
          .execute();
      } else {
        await ctx.db
          .update(individualUser)
          .set({
            photo: input.photo ?? null,
          })
          .where(eq(individualUser.userId, user.id))
          .execute();
      }
    }),

  getProfilePhoto: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const individual = await ctx.db
      .select({
        photo: individualUser.photo,
      })
      .from(individualUser)
      .where(eq(individualUser.userId, user.id))
      .execute();

    return individual[0];
  }),

  addIndividualDetails: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        designation: z.string().optional(),
        contactNumber: z.string().optional(),
        email: z.string().optional(),
        fullAddress: z.string().optional(),
        file: z.string().optional(),
        bio: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      const individual = await ctx.db
        .select({
          id: individualUser.id,
        })
        .from(individualUser)
        .where(eq(individualUser.userId, user.id))
        .execute();

      if (individual.length === 0) {
        await ctx.db
          .insert(individualUser)
          .values({
            userId: user.id,
            ...input,
          })
          .execute();
      } else {
        await ctx.db
          .update(individualUser)
          .set({
            ...input,
          })
          .where(eq(individualUser.userId, user.id))
          .execute();
      }
      return individual;
    }),

  getInviteHistory: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const sentInvites = await ctx.db
      .select({
        id: companyInvites.id,
        email: companyInvites.email,
        phoneNumber: companyInvites.phoneNumber,
        status: companyInvites.status,
        createdAt: companyInvites.createdAt,
        role: companyInvites.role,
        companyId: companyInvites.companyUserId,
        // Company details
        individualPhoto: individualUser.photo,
        companyName: companyUser.companyName,
        companyPhoto: companyUser.photo,
      })
      .from(companyInvites)
      .innerJoin(
        companyUser,
        eq(companyInvites.companyUserId, companyUser.userId),
      )
      .leftJoin(
        individualUser,
        or(
          eq(companyInvites.email, individualUser.email),
          eq(companyInvites.phoneNumber, individualUser.contactNumber),
        ),
      )
      .where(eq(companyInvites.inviterId, user.id))
      .orderBy(desc(companyInvites.createdAt))
      .execute();

    return sentInvites.map((invite) => ({
      id: invite.id,
      company: invite.companyName,
      logo: invite.companyPhoto,
      individualPhoto: invite.individualPhoto,
      companyId: invite.companyId,
      role: invite.role,
      message: `Invite sent to ${invite.email ?? invite.phoneNumber}`,
      date: invite.createdAt
        ? invite.createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          })
        : "",
      status: invite.status,
    }));
  }),

  getApprovedCompanies: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    // First get user details
    const user = await ctx.db
      .select({
        email: usersTable.email,
        phone: usersTable.phone,
        name: individualUser.name,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .leftJoin(individualUser, eq(individualUser.userId, usersTable.id))
      .limit(1);

    if (!user?.[0]) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    // Create conditions array for better type safety
    const conditions = [
      eq(companyInvites.isUserApproved, true),
      eq(companyInvites.status, "accepted"),
    ];

    // Add email condition if email exists
    if (user[0].email) {
      conditions.push(eq(companyInvites.email, user[0].email));
    }

    // Add phone condition if phone exists
    if (user[0].phone) {
      conditions.push(eq(companyInvites.phoneNumber, user[0].phone));
    }

    // Get approved companies with matching email or phone
    const approvedCompanies = await ctx.db
      .select({
        companyId: companyInvites.companyUserId,
        inviteId: companyInvites.inviteId,
        companyName: companyUser.companyName,
        companyPhoto: companyUser.photo,
        status: companyInvites.status,
        isUserApproved: companyInvites.isUserApproved,
        location: companyUser.companyAddress,
        sector: companyUser.sectors,
      })
      .from(companyInvites)
      .innerJoin(
        companyUser,
        eq(companyInvites.companyUserId, companyUser.userId),
      )
      .where(
        and(
          // Base conditions (approval and status)
          eq(companyInvites.isUserApproved, true),
          eq(companyInvites.status, "accepted"),
          // Email or phone matching
          or(
            user[0].email
              ? eq(companyInvites.email, user[0].email)
              : sql`false`,
            user[0].phone
              ? eq(companyInvites.phoneNumber, user[0].phone)
              : sql`false`,
          ),
        ),
      );

    return {
      companies: approvedCompanies,
      user: user[0],
    };
  }),

  addExpression: protectedProcedure
    .input(
      z.object({
        companyUserId: z.string(),
        expressType: z.string(),
        expressMessage: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      await ctx.db
        .insert(companyExpress)
        .values({
          ...input,
          userId: user.id,
        })
        .execute();
    }),

  acceptExpression: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      await ctx.db
        .update(companyExpress)
        .set({ isApproved: true })
        .where(eq(companyExpress.id, input.id))
        .execute();
    }),

  getIndividualDetails: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const individual = await ctx.db
      .select()
      .from(individualUser)
      .where(eq(individualUser.userId, user.id))
      .execute();

    return individual[0];
  }),

  addEndorsement: protectedProcedure
    .input(
      z.object({
        companyId: z.string(),

        message: z.string(),
        audioUrl: z.string().optional(),
        files: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Create the endorsement
        await ctx.db.insert(companyEndorse).values({
          userId: ctx.user.id,
          companyUserId: input.companyId,
          endorseMessage: input.message,
          audioFile: input.audioUrl,
          files: input.files,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return { success: true };
      } catch (error) {
        throw new Error("Failed to submit endorsement");
      }
    }),

  addIndividualDocuments: protectedProcedure
    .input(
      z.object({
        file: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.insert(individualDocuments).values({
          userId: ctx.user.id,
          file: input.file,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        return { success: true };
      } catch (error) {
        throw new Error("Failed to add document");
      }
    }),

  deleteIndividualDocument: protectedProcedure
    .input(
      z.object({
        file: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Delete document while ensuring it belongs to the current user
        await ctx.db
          .delete(individualDocuments)
          .where(
            and(
              eq(individualDocuments.file, input.file),
              eq(individualDocuments.userId, ctx.user.id),
            ),
          );

        return { success: true };
      } catch (error) {
        throw new Error("Failed to delete document");
      }
    }),

  getIndividualDocuments: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const documents = await ctx.db
      .select()
      .from(individualDocuments)
      .where(eq(individualDocuments.userId, user.id))
      .execute();

    return documents;
  }),

  getNetwork: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const network = await ctx.db
      .select({
        id: companyUser.id,
        userId: companyUser.userId,
        name: companyUser.companyName,
        photo: companyUser.photo,
        contactNumber: companyUser.officePhone,
        email: companyUser.companyEmailID,
        designation: companyUser.sectors,
        address: companyUser.companyAddress,
        isUserApproved: companyInvites.isUserApproved,
      })
      .from(companyUser)
      .innerJoin(
        companyInvites,
        eq(companyUser.userId, companyInvites.companyUserId),
      )
      .innerJoin(usersTable, eq(usersTable.id, user.id))
      .where(
        and(
          // Match either email or phone number from usersTable
          or(
            eq(companyInvites.email, usersTable.email),
            eq(companyInvites.phoneNumber, usersTable.phone),
          ),
          // Only get accepted and approved invites
          eq(companyInvites.status, "accepted"),
        ),
      )
      .execute();

    return network;
  }),

  getExpressionHistory: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const expressions = await ctx.db
      .select({
        id: companyExpress.id,
        expressType: companyExpress.expressType,
        expressMessage: companyExpress.expressMessage,
        isApproved: companyExpress.isApproved,
        createdAt: companyExpress.createdAt,
        // Company details
        companyName: companyUser.companyName,
        companyLogo: companyUser.photo,
      })
      .from(companyExpress)
      .innerJoin(
        companyUser,
        eq(companyExpress.companyUserId, companyUser.userId),
      )
      .where(eq(companyExpress.userId, user.id))
      .orderBy(desc(companyExpress.createdAt));

    return expressions;
  }),

  getEndorsementHistory: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const endorsements = await ctx.db
      .select({
        id: companyEndorse.id,
        endorseMessage: companyEndorse.endorseMessage,
        audioFile: companyEndorse.audioFile,
        files: companyEndorse.files,
        isApproved: companyEndorse.isApproved,
        createdAt: companyEndorse.createdAt,
        // Company details
        companyName: companyUser.companyName,
        companyLogo: companyUser.photo,
      })
      .from(companyEndorse)
      .innerJoin(
        companyUser,
        eq(companyEndorse.companyUserId, companyUser.userId),
      )
      .where(eq(companyEndorse.userId, user.id))
      .orderBy(desc(companyEndorse.createdAt));

    return endorsements;
  }),

  getProfileSetup: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const individualProfile = await ctx.db
        .select({
          id: individualUser.id,
          userId: individualUser.userId,
          phone: usersTable.phone,
          email: usersTable.email,
          userTableId: usersTable.id,
          individualUserId: individualUser.userId,
          photo: individualUser.photo,
          name: individualUser.name,
          designation: individualUser.designation,
          contactNumber: individualUser.contactNumber,
          individualEmail: individualUser.email,
          fullAddress: individualUser.fullAddress,
          bio: individualUser.bio,
          file: individualDocuments.file,
        })
        .from(individualUser)
        .leftJoin(individualDocuments, eq(individualDocuments.userId, input.id))
        .leftJoin(usersTable, eq(usersTable.id, input.id))
        .where(eq(individualUser.userId, input.id));

      if (!individualProfile || individualProfile.length === 0) {
        return {
          individualUser: null,
          completionPercentage: 0,
        };
      }

      const profilefilled = individualProfile[0];

      const profileFields: (keyof (typeof individualProfile)[0])[] = [
        "phone",
        "email",
        "photo",
        "name",
        "bio",
        "contactNumber",
        "designation",
        "file",
        "fullAddress",
        "individualEmail",
      ];

      const filledFieldsCount = profileFields.filter(
        (field) =>
          profilefilled?.[field] !== undefined &&
          profilefilled?.[field] !== null &&
          profilefilled?.[field] !== "",
      ).length;

      const completionPercentage =
        (filledFieldsCount / profileFields.length) * 100;

      const roundedPercentage = Math.round(completionPercentage);

      return {
        individual: individualProfile[0],
        completionPercentage: `${roundedPercentage}%`,
      };
    }),
});

import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  companyInvites,
  companyUser,
  individualUser,
  usersTable,
} from "@/server/db/schema";
import { eq, and, or, ne } from "drizzle-orm";
import { inviteEmail, createPhoneInvite } from "@/lib/company-invite-user";
import { db } from "@/server/db";
import { lucia } from "@/server/auth";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { cookies } from "next/headers";
import { TRPCError } from "@trpc/server";
import { sql } from "drizzle-orm";

export const companyNotificationRouter = createTRPCRouter({
  getInviteHistory: protectedProcedure.query(async ({ ctx }) => {
    const inviteHistory = await db
      .select({
        id: companyInvites.id,
        status: companyInvites.status,
        updatedAt: companyInvites.updatedAt,
        email: companyInvites.email,
        phoneNumber: companyInvites.phoneNumber,
        individualId: individualUser.userId,
        isUserApproved: companyInvites.isUserApproved,
        isUserdeclined: companyInvites.isUserdeclined,
        companyName: companyUser.companyName,
        individualPhoto: individualUser.photo,
        companyPhoto: companyUser.photo,
        role: companyInvites.role,
      })
      .from(companyInvites)
      .where(
        and(
          eq(companyInvites.companyUserId, ctx.user.id),
          eq(companyInvites.isUserdeclined, false),
        ),
      )
      .leftJoin(
        companyUser,
        eq(companyInvites.companyUserId, companyUser.userId),
      )
      .leftJoin(
        individualUser,
        or(
          eq(companyInvites.email, individualUser.email),
          eq(companyInvites.phoneNumber, individualUser.contactNumber),
        ),
      );

    return inviteHistory;
  }),

  getInviteHistoryCount: protectedProcedure.query(async ({ ctx }) => {
    const inviteHistory = await db
      .select({
        count: sql<number>`cast(count(${companyInvites.id}) as integer)`,
      })
      .from(companyInvites)
      .where(
        and(
          eq(companyInvites.companyUserId, ctx.user.id),
          eq(companyInvites.status, "accepted"),
          eq(companyInvites.isUserApproved, false),
          eq(companyInvites.isUserdeclined, false),
        ),
      );

    return inviteHistory[0]?.count ?? 0;
  }),
});

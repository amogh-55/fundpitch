import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { db } from "@/server/db";
import { verify } from "@node-rs/argon2";
import { eq, ilike, desc } from "drizzle-orm";
import {
  companyBoardOfDirectors,
  companyBusinessVertical,
  companyDeck,
  companyFinancialDoc,
  companyKeyManagament,
  companyProducts,
  companyUser,
  individualUser,
  usersTable,
  userTypeChangeRequests,
} from "@/server/db/schema";
import { lucia } from "@/server/auth";
import { cookies } from "next/headers";

export const adminRouter = createTRPCRouter({
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string().min(1),
      }),
    )
    .mutation(async ({ input: { email, password } }) => {
      const response = await db
        .select({
          passwordHash: usersTable.passwordHash,
          id: usersTable.id,
          userType: usersTable.userType,
        })
        .from(usersTable)
        .where(ilike(usersTable.email, email))
        .execute();

      const user = response[0];

      console.log(user);

      if (!user) {
        throw new Error("User not found");
      }

      if (!user.passwordHash) {
        throw new Error("Invalid Credentials");
      }

      const validPassword = await verify(user.passwordHash, password);
      if (!validPassword) {
        throw new Error("Incorrect username or password");
      }

      if (user.userType !== "admin") {
        throw new Error("Invalid Credentials");
      }

      const session = await lucia.createSession(user.id, {});

      const sessionCookie = lucia.createSessionCookie(session.id);

      (await cookies()).set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      );

      return { user };
    }),

  getDashboardData: publicProcedure.query(async () => {
    const company = await db
      .select({
        id: companyUser.id,
        photo: companyUser.photo,
        name: companyUser.companyName,
        contactNumber: companyUser.officePhone,
        email: companyUser.companyEmailID,
        userType: usersTable.userType,
        userId: companyUser.userId,
      })
      .from(companyUser)
      .leftJoin(usersTable, eq(usersTable.id, companyUser.userId))
      .where(eq(companyUser.isApproved, false))
      .execute();

    const dashboardData = [...company];

    const pendingData = dashboardData.length;

    return {
      dashboardData,
      pendingData,
    };
  }),

  getCompanyData: publicProcedure.query(async () => {
    const company = await db
      .select({
        id: companyUser.id,
        photo: companyUser.photo,
        name: companyUser.companyName,
        contactNumber: companyUser.officePhone,
        email: companyUser.companyEmailID,
        userType: usersTable.userType,
        userId: companyUser.userId,
        isApproved: companyUser.isApproved,
      })
      .from(companyUser)
      .leftJoin(usersTable, eq(usersTable.id, companyUser.userId))
      .execute();

    const dashboardData = [...company];

    const pendingData = dashboardData.length;

    return {
      dashboardData,
      pendingData,
    };
  }),

  getDashboardCount: publicProcedure.query(async () => {
    const company = await db
      .select({
        id: companyUser.id,
      })
      .from(companyUser)
      .where(eq(companyUser.isApproved, false))
      .execute();

    const getRoleChangeCount = await db
      .select({
        id: userTypeChangeRequests.id,
      })
      .from(userTypeChangeRequests)
      .where(eq(userTypeChangeRequests.status, "pending"))
      .execute();

    return {
      pendingApprovals: company.length,
      pendingRoleChanges: getRoleChangeCount.length,
    };
  }),

  getRoleChangeRequests: publicProcedure.query(async () => {
    const roleChangeRequests = await db
      .select({
        id: userTypeChangeRequests.id,
        userId: userTypeChangeRequests.userId,
        currentType: userTypeChangeRequests.currentType,
        requestedType: userTypeChangeRequests.requestedType,
        status: userTypeChangeRequests.status,
        createdAt: userTypeChangeRequests.createdAt,
        updatedAt: userTypeChangeRequests.updatedAt,
        madeBy: userTypeChangeRequests.madeBy,
      })
      .from(userTypeChangeRequests)
      .where(eq(userTypeChangeRequests.status, "pending"))
      .execute();

    return roleChangeRequests;
  }),

  getCompanyHomeDetails: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userId = input ?? "";

      const company = await ctx.db
        .select({
          id: companyUser.id,
          userId: companyUser.userId,
          photo: companyUser.photo,
          officePhone: companyUser.officePhone,
          companyName: companyUser.companyName,
          registartionNumber: companyUser.registartionNumber,
          class: companyUser.class,
          listingStatus: companyUser.listingStatus,
          stage: companyUser.stage,
          yearOfIncorporation: companyUser.yearOfIncorporation,
          marketCapital: companyUser.marketCapital,
          sectors: companyUser.sectors,
          companyEmailID: companyUser.companyEmailID,
          companyAddress: companyUser.companyAddress,
          companyWebsiteURL: companyUser.companyWebsiteURL,
          about: companyUser.about,
        })
        .from(companyUser)
        .where(eq(companyUser.userId, userId))
        .execute();

      return company[0];
    }),

  getCompanyKeyManagament: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userId = input ?? "";

      const company = await ctx.db
        .select({
          id: companyKeyManagament.id,
          userId: companyKeyManagament.userId,
          photo: companyKeyManagament.photo,
          teamStrength: companyKeyManagament.teamStrength,
          nameOfTheMember: companyKeyManagament.nameOfTheMember,
          role: companyKeyManagament.role,
        })
        .from(companyKeyManagament)
        .where(eq(companyKeyManagament.userId, userId))
        .execute();

      return company;
    }),

  getCompanyBod: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userId = input ?? "";

      const company = await ctx.db
        .select({
          id: companyBoardOfDirectors.id,
          userId: companyBoardOfDirectors.userId,
          photo: companyBoardOfDirectors.photo,
          nameOfTheMember: companyBoardOfDirectors.nameOfTheMember,
          role: companyBoardOfDirectors.role,
        })
        .from(companyBoardOfDirectors)
        .where(eq(companyBoardOfDirectors.userId, userId))
        .execute();

      return company;
    }),

  getCompanyBusinessVertical: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userId = input ?? "";

      const company = await ctx.db
        .select({
          id: companyBusinessVertical.id,
          userId: companyBusinessVertical.userId,
          photo: companyBusinessVertical.photo,
          nameOfTheMember: companyBusinessVertical.nameOfTheBusinessVertical,
          about: companyBusinessVertical.about,
        })
        .from(companyBusinessVertical)
        .where(eq(companyBusinessVertical.userId, userId))
        .execute();

      return company;
    }),

  getCompanyCoporatDeck: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userId = input ?? "";

      const company = await ctx.db
        .select({
          id: companyDeck.id,
          userId: companyDeck.userId,
          file: companyDeck.file,
          fileName: companyDeck.fileName,
          createdAt: companyDeck.createdAt,
        })
        .from(companyDeck)
        .where(eq(companyDeck.userId, userId))
        .execute();

      return company;
    }),

  getCompanyfinancial: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userId = input ?? "";

      const company = await ctx.db
        .select({
          id: companyFinancialDoc.id,
          userId: companyFinancialDoc.userId,
          file: companyFinancialDoc.file,
          fileName: companyFinancialDoc.fileName,
          fileType: companyFinancialDoc.fileType,
          createdAt: companyFinancialDoc.createdAt,
        })
        .from(companyFinancialDoc)
        .where(eq(companyFinancialDoc.userId, userId))
        .execute();

      return company;
    }),

  getCompanyProduct: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userId = input ?? "";

      const company = await ctx.db
        .select({
          id: companyProducts.id,
          userId: companyProducts.userId,
          photo: companyProducts.photo,
          nameOfTheProduct: companyProducts.nameOfTheProduct,
          productType: companyProducts.productType,
          about: companyProducts.about,
          createdAt: companyProducts.createdAt,
          updatedAt: companyProducts.updatedAt,
        })
        .from(companyProducts)
        .where(eq(companyProducts.userId, userId))
        .execute();

      return company;
    }),

  getIndividualDetails: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userId = input ?? "";

      const individual = await ctx.db
        .select({
          id: individualUser.id,
          userId: individualUser.userId,
          photo: individualUser.photo,
          name: individualUser.name,
          designation: individualUser.designation,
          contactNumber: individualUser.contactNumber,
          email: individualUser.email,
          fullAddress: individualUser.fullAddress,

          bio: individualUser.bio,
          createdAt: individualUser.createdAt,
          updatedAt: individualUser.updatedAt,
        })
        .from(individualUser)
        .where(eq(individualUser.userId, userId))
        .execute();

      return individual[0];
    }),

  getPendingRoleChangeRequests: protectedProcedure.query(async ({ ctx }) => {
    const requests = await ctx.db
      .select({
        id: userTypeChangeRequests.id,
        userId: userTypeChangeRequests.userId,
        currentType: userTypeChangeRequests.currentType,
        requestedType: userTypeChangeRequests.requestedType,
        madeBy: userTypeChangeRequests.madeBy,
        status: userTypeChangeRequests.status,
        createdAt: userTypeChangeRequests.createdAt,
        // Get user details
        userName: individualUser.name,
        userPhoto: individualUser.photo,
        // Get company details
        companyName: companyUser.companyName,
        companyLogo: companyUser.photo,
      })
      .from(userTypeChangeRequests)
      .innerJoin(usersTable, eq(userTypeChangeRequests.userId, usersTable.id))
      .innerJoin(individualUser, eq(usersTable.id, individualUser.userId))
      .innerJoin(
        companyUser,
        eq(companyUser.userId, userTypeChangeRequests.madeBy),
      )
      .where(eq(userTypeChangeRequests.status, "pending"))
      .orderBy(desc(userTypeChangeRequests.createdAt));

    return requests;
  }),

  getCompanyDetails: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const userId = input ?? "";

      const company = await ctx.db
        .select({
          isApproved: companyUser.isApproved,
        })
        .from(companyUser)
        .where(eq(companyUser.userId, userId));

      return company[0];
    }),

  approveCompany: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = input ?? "";

      await ctx.db
        .update(companyUser)
        .set({
          isApproved: true,
        })
        .where(eq(companyUser.userId, userId));

      return { success: true };
    }),

  rejectCompany: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = input ?? "";

      await ctx.db
        .update(companyUser)
        .set({
          isApproved: false,
        })
        .where(eq(companyUser.userId, userId));

      return { success: true };
    }),
  handleRoleChangeRequest: protectedProcedure
    .input(
      z.object({
        requestId: z.string(),
        status: z.enum(["approved", "rejected"]),
        adminComment: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Update request status
      await ctx.db
        .update(userTypeChangeRequests)
        .set({
          status: input.status,
          adminComment: input.adminComment,
          updatedAt: new Date(),
        })
        .where(eq(userTypeChangeRequests.id, input.requestId));

      // If approved, update user type
      if (input.status === "approved") {
        const request = await ctx.db
          .select()
          .from(userTypeChangeRequests)
          .where(eq(userTypeChangeRequests.id, input.requestId))
          .limit(1);

        if (request[0]) {
          await ctx.db
            .update(usersTable)
            .set({
              userType: request[0].requestedType,
            })
            .where(eq(usersTable.id, request[0].userId));
        }
      }

      return { success: true };
    }),
});

import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { db } from "@/server/db";
import {
  companyBoardOfDirectors,
  companyBusinessVertical,
  companyDeck,
  companyEndorse,
  companyFinancialDoc,
  companyInvites,
  companyKeyManagament,
  companyProducts,
  companySubsidiaries,
  companyUser,
  individualDocuments,
  individualUser,
} from "@/server/db/schema";
import { and, eq, desc, or } from "drizzle-orm";

export const overViewProfileRouter = createTRPCRouter({
  getCompanyPhoto: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const company = await ctx.db
        .select({
          photo: companyUser.photo,
        })
        .from(companyUser)
        .where(eq(companyUser.userId, user));

      return company[0];
    }),

  getBasicDetails: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      console.log(`User: ${user} from company`);

      const company = await ctx.db
        .select({
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
        .where(eq(companyUser.userId, user));

      return company[0];
    }),

  getBoardOfDirectors: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const boardOfDirectors = await ctx.db
        .select()
        .from(companyBoardOfDirectors)
        .where(eq(companyBoardOfDirectors.userId, user));

      return boardOfDirectors;
    }),

  getKeyManagament: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const keyManagament = await ctx.db
        .select()
        .from(companyKeyManagament)
        .where(eq(companyKeyManagament.userId, user));

      return keyManagament;
    }),

  getBusinessVertical: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const businessVertical = await ctx.db
        .select()
        .from(companyBusinessVertical)
        .where(eq(companyBusinessVertical.userId, user));

      return businessVertical;
    }),

  getCorporateDecks: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const corporateDecks = await ctx.db
        .select()
        .from(companyDeck)
        .where(eq(companyDeck.userId, user));

      return corporateDecks;
    }),

  getFinancialDocs: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const financialDocs = await ctx.db
        .select()
        .from(companyFinancialDoc)
        .where(eq(companyFinancialDoc.userId, user));

      return financialDocs;
    }),

  getProducts: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const products = await ctx.db
        .select()
        .from(companyProducts)
        .where(eq(companyProducts.userId, user));

      return products;
    }),

  getCompanyDetails: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const companyDetails = await ctx.db.query.companyUser.findFirst({
        where: eq(companyUser.id, user),
        with: {
          companyBoardOfDirectors: true,
          companyKeyManagament: true,
          companyBusinessVertical: true,
          companyDeck: true,
          companyProducts: true,
          companyFinancialDoc: true,
        },
      });

      return companyDetails;
    }),

  getHomeDetails: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const homeDetails = await ctx.db.query.companyUser.findFirst({
        where: eq(companyUser.userId, user),
        columns: {
          about: true,
        },
      });

      console.log({ homeDetails: homeDetails?.about });

      return homeDetails;
    }),

  getInviteHistory: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const inviteHistory = await db
        .select({
          id: companyInvites.id,
          status: companyInvites.status,
          updatedAt: companyInvites.updatedAt,
          email: companyInvites.email,
          phoneNumber: companyInvites.phoneNumber,
          individualId: individualUser.userId,
          isUserApproved: companyInvites.isUserApproved,
          companyName: companyUser.companyName,
          companyPhoto: companyUser.photo,
          role: companyInvites.role,
        })
        .from(companyInvites)
        .where(eq(companyInvites.companyUserId, user))
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

  getCompanyEndorsements: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const endorsements = await ctx.db
        .select({
          id: companyEndorse.id,
          message: companyEndorse.endorseMessage,
          audioUrl: companyEndorse.audioFile,
          files: companyEndorse.files,
          createdAt: companyEndorse.createdAt,
          // Get individual user details
          userName: individualUser.name,
          userPhoto: individualUser.photo,
        })
        .from(companyEndorse)
        .innerJoin(
          individualUser,
          eq(companyEndorse.userId, individualUser.userId),
        )
        .where(eq(companyEndorse.companyUserId, user))
        .orderBy(desc(companyEndorse.createdAt));

      return endorsements;
    }),

  getTeamKeyManagament: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const keyManagament = await ctx.db
        .select()
        .from(companyKeyManagament)
        .where(eq(companyKeyManagament.userId, user));

      return keyManagament;
    }),

  getTeamBoardOfDirectors: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const boardOfDirectors = await ctx.db
        .select()
        .from(companyBoardOfDirectors)
        .where(eq(companyBoardOfDirectors.userId, user));

      return boardOfDirectors;
    }),

  getBusinessVerticalDetails: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const businessVerticalDetails = await ctx.db
        .select()
        .from(companyBusinessVertical)
        .where(eq(companyBusinessVertical.userId, user));

      return businessVerticalDetails;
    }),

  getProductsDetails: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const productsDetails = await ctx.db
        .select()
        .from(companyProducts)
        .where(eq(companyProducts.userId, user));

      return productsDetails;
    }),

  getAboutTeam: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const homeDetails = await ctx.db.query.companyUser.findFirst({
        where: eq(companyUser.userId, user),
        columns: {
          aboutTeam: true,
        },
      });
      return homeDetails;
    }),

  getSubsidiaries: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const subsidiaries = await ctx.db
        .select()
        .from(companySubsidiaries)
        .where(eq(companySubsidiaries.userId, user));

      return subsidiaries;
    }),

  ///individual

  getProfilePhoto: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const individual = await ctx.db
        .select({
          photo: individualUser.photo,
        })
        .from(individualUser)
        .where(eq(individualUser.userId, user))
        .execute();

      return individual;
    }),

  getIndividualDetails: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const individual = await ctx.db
        .select()
        .from(individualUser)
        .where(eq(individualUser.userId, user))
        .execute();

      return individual[0];
    }),

  getIndividualDocuments: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = input.id;

      const documents = await ctx.db
        .select()
        .from(individualDocuments)
        .where(eq(individualDocuments.userId, user));

      return documents;
    }),
});

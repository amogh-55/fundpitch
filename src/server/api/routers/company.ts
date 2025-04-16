import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { db } from "@/server/db";
import {
  companyBoardOfDirectors,
  companyBusinessVertical,
  companyDeck,
  companyFinancialDoc,
  companyKeyManagament,
  companyProducts,
  companySubsidiaries,
  companyUser,
  companyExpress,
  individualUser,
  usersTable,
  companyInvites,
  companyEndorse,
} from "@/server/db/schema";
import { and, eq, desc, sql, or } from "drizzle-orm";
import { format } from "date-fns";

export const companyRouter = createTRPCRouter({
  updateCompanyPhoto: protectedProcedure
    .input(
      z.object({
        photo: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      const company = await ctx.db
        .select({
          id: companyUser.userId,
        })
        .from(companyUser)
        .where(eq(companyUser.userId, user.id))
        .execute();

      if (company.length === 0) {
        await ctx.db
          .insert(companyUser)
          .values({
            userId: user.id,
            photo: input.photo ?? null,
          })
          .execute();
      } else {
        await ctx.db
          .update(companyUser)
          .set({
            photo: input.photo ?? null,
          })
          .where(eq(companyUser.userId, user.id))
          .execute();
      }
    }),

  getCompanyPhoto: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const company = await ctx.db
      .select({
        photo: companyUser.photo,
        name: companyUser.founderName,
      })
      .from(companyUser)
      .where(eq(companyUser.userId, user.id));

    return company[0];
  }),

  getConnectedAdvisors: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const connectedUsers = await ctx.db
      .select({
        id: usersTable.id,
        name: individualUser.name,
        photo: individualUser.photo,
        userType: usersTable.userType,
        email: companyInvites.email,
        phone: companyInvites.phoneNumber,
      })
      .from(companyInvites)
      .innerJoin(
        usersTable,
        and(
          or(
            eq(usersTable.email, companyInvites.email ?? ""),
            eq(usersTable.phone, companyInvites.phoneNumber ?? ""),
          ),
        ),
      )
      .innerJoin(individualUser, eq(usersTable.id, individualUser.userId))
      .where(
        and(
          eq(companyInvites.companyUserId, user.id),
          eq(companyInvites.isUserApproved, true),
          eq(companyInvites.status, "accepted"),
        ),
      );

    return connectedUsers;
  }),

  registerCompanyDetails: protectedProcedure
    .input(
      z.object({
        companyName: z.string().optional(),
        founderName: z.string().optional(),
        registartionNumber: z.string().optional(),
        class: z.string().optional(),
        listingStatus: z.string().optional(),
        stage: z.string().optional(),
        yearOfIncorporation: z.string().optional(),
        marketCapital: z.string().optional(),
        sectors: z.string().optional(),
        companyEmailID: z.string().optional(),
        companyWebsiteURL: z.string().optional(),
        companyAddress: z.string().optional(),
        officePhone: z.string().optional(),
        about: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      const existingCompany = await ctx.db
        .select()
        .from(companyUser)
        .where(eq(companyUser.userId, user.id))
        .execute();

      let company;

      if (existingCompany.length === 0) {
        company = await ctx.db
          .insert(companyUser)
          .values({
            userId: user.id,
            ...input,
          })
          .returning();
      } else {
        company = await ctx.db
          .update(companyUser)
          .set({
            companyName: input.companyName,
            officePhone: input.officePhone,
            founderName: input.founderName,
            registartionNumber: input.registartionNumber,
            class: input.class,
            listingStatus: input.listingStatus,
            stage: input.stage,
            yearOfIncorporation: input.yearOfIncorporation,
            marketCapital: input.marketCapital,
            sectors: input.sectors,
            companyEmailID: input.companyEmailID,
            companyWebsiteURL: input.companyWebsiteURL,
            companyAddress: input.companyAddress,
            about: input.about,
          })
          .where(eq(companyUser.userId, user.id))
          .returning();
      }

      return company;
    }),

  getBasicDetails: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const company = await ctx.db
      .select({
        userId: companyUser.userId,
        photo: companyUser.photo,
        officePhone: companyUser.officePhone,
        companyName: companyUser.companyName,
        founderName: companyUser.founderName,
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
      .where(eq(companyUser.userId, user.id));

    return company[0];
  }),

  addBoardOfDirectors: protectedProcedure
    .input(
      z.object({
        photo: z.string(),
        nameOfTheMember: z.string(),
        role: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      const company = await ctx.db
        .insert(companyBoardOfDirectors)
        .values({
          ...input,
          userId: user.id,
        })
        .returning();
    }),

  getBoardOfDirectors: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const boardOfDirectors = await ctx.db
      .select()
      .from(companyBoardOfDirectors)
      .where(eq(companyBoardOfDirectors.userId, user.id));

    return boardOfDirectors;
  }),

  addKeyManagament: protectedProcedure
    .input(
      z.object({
        photo: z.string(),
        nameOfTheMember: z.string(),
        role: z.string(),
        teamStrength: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      const maxOrderResult = await ctx.db
        .select({
          maxOrder: sql`COALESCE(MAX(${companyKeyManagament.order}), 0)`,
        })
        .from(companyKeyManagament)
        .where(eq(companyKeyManagament.userId, user.id));

      const nextOrder = Number(maxOrderResult[0]?.maxOrder ?? 0) + 1;

      await ctx.db
        .insert(companyKeyManagament)
        .values({
          ...input,
          userId: user.id,
          order: nextOrder,
        })
        .returning();
    }),

  getKeyManagament: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const keyManagament = await ctx.db
      .select()
      .from(companyKeyManagament)
      .where(eq(companyKeyManagament.userId, user.id))
      .orderBy(companyKeyManagament.order);

    return keyManagament;
  }),

  addBusinessVertical: protectedProcedure
    .input(
      z.object({
        photo: z.string(),
        nameOfTheBusinessVertical: z.string(),
        about: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      await ctx.db
        .insert(companyBusinessVertical)
        .values({
          ...input,
          userId: user.id,
        })
        .returning();
    }),

  deleteBusinessVertical: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(companyBusinessVertical)
        .where(eq(companyBusinessVertical.id, input.id));
    }),

  deleteBoardOfDirector: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(companyBoardOfDirectors)
        .where(eq(companyBoardOfDirectors.id, input.id));
    }),

  deleteKeyManager: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(companyKeyManagament)
        .where(eq(companyKeyManagament.id, input.id));
    }),

  updateKeyManagerPhoto: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        photo: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(companyKeyManagament)
        .set({ photo: input.photo })
        .where(eq(companyKeyManagament.id, input.id));
    }),
  updateBoardDirectorPhoto: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        photo: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(companyBoardOfDirectors)
        .set({ photo: input.photo })
        .where(eq(companyBoardOfDirectors.id, input.id));
    }),

  getBusinessVertical: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const businessVertical = await ctx.db
      .select()
      .from(companyBusinessVertical)
      .where(eq(companyBusinessVertical.userId, user.id));

    return businessVertical;
  }),

  addCorporateDeck: protectedProcedure
    .input(
      z.object({
        file: z.string(),
        fileName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      await ctx.db
        .insert(companyDeck)
        .values({
          ...input,
          userId: user.id,
        })
        .returning();
    }),

  getCorporateDecks: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const corporateDecks = await ctx.db
      .select()
      .from(companyDeck)
      .where(eq(companyDeck.userId, user.id));

    return corporateDecks;
  }),

  addFinancialDocs: protectedProcedure
    .input(
      z.object({
        file: z.string(),
        fileName: z.string(),
        fileType: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      await ctx.db
        .insert(companyFinancialDoc)
        .values({
          ...input,
          userId: user.id,
        })
        .returning();
    }),

  getFinancialDocs: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const financialDocs = await ctx.db
      .select()
      .from(companyFinancialDoc)
      .where(eq(companyFinancialDoc.userId, user.id));

    return financialDocs;
  }),

  deleteFinancialDoc: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      await ctx.db
        .delete(companyFinancialDoc)
        .where(eq(companyFinancialDoc.id, input.id));
    }),

  deleteCorporateDeck: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      await ctx.db.delete(companyDeck).where(eq(companyDeck.id, input.id));
    }),

  addProducts: protectedProcedure
    .input(
      z.object({
        photo: z.string(),
        nameOfTheProduct: z.string(),
        productType: z.string(),
        about: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      await ctx.db
        .insert(companyProducts)
        .values({
          ...input,
          userId: user.id,
        })
        .returning();
    }),

  getProducts: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const products = await ctx.db
      .select()
      .from(companyProducts)
      .where(eq(companyProducts.userId, user.id));

    return products;
  }),

  getCompanyDetails: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const companyDetails = await ctx.db.query.companyUser.findFirst({
      where: eq(companyUser.id, user.id),
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

  getHomeDetails: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const homeDetails = await ctx.db.query.companyUser.findFirst({
      where: eq(companyUser.userId, user.id),
      columns: {
        about: true,
      },
    });

    console.log({ homeDetails: homeDetails?.about });

    return homeDetails;
  }),

  getTeamKeyManagament: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const keyManagament = await ctx.db
      .select()
      .from(companyKeyManagament)
      .where(eq(companyKeyManagament.userId, user.id))
      .orderBy(companyKeyManagament.order);

    return keyManagament;
  }),

  getTeamBoardOfDirectors: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const boardOfDirectors = await ctx.db
      .select()
      .from(companyBoardOfDirectors)
      .where(eq(companyBoardOfDirectors.userId, user.id));

    return boardOfDirectors;
  }),

  getBusinessVerticalDetails: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const businessVerticalDetails = await ctx.db
      .select()
      .from(companyBusinessVertical)
      .where(eq(companyBusinessVertical.userId, user.id));

    return businessVerticalDetails;
  }),

  getProductsDetails: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const productsDetails = await ctx.db
      .select()
      .from(companyProducts)
      .where(eq(companyProducts.userId, user.id));

    return productsDetails;
  }),

  updateCompanyAboutTeam: protectedProcedure
    .input(
      z.object({
        aboutTeam: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      const company = await ctx.db
        .select({
          id: companyUser.userId,
        })
        .from(companyUser)
        .where(eq(companyUser.userId, user.id))
        .execute();

      if (company.length === 0) {
        await ctx.db
          .insert(companyUser)
          .values({
            userId: user.id,
            aboutTeam: input.aboutTeam ?? null,
          })
          .execute();
      } else {
        await ctx.db
          .update(companyUser)
          .set({
            aboutTeam: input.aboutTeam ?? null,
          })
          .where(eq(companyUser.userId, user.id))
          .execute();
      }
    }),

  getAboutTeam: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    const homeDetails = await ctx.db.query.companyUser.findFirst({
      where: eq(companyUser.userId, user.id),
      columns: {
        aboutTeam: true,
      },
    });
    return homeDetails;
  }),

  addSubsidiary: protectedProcedure
    .input(
      z.object({
        nodeId: z.string(),
        label: z.string(),
        parentId: z.string().optional(),
        position: z.object({
          x: z.number(),
          y: z.number(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const subsidiary = await ctx.db
        .insert(companySubsidiaries)
        .values({
          ...input,
          userId: ctx.user.id,
        })
        .returning();
      return subsidiary[0];
    }),

  updateSubsidiaryLabel: protectedProcedure
    .input(
      z.object({
        nodeId: z.string(),
        label: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(companySubsidiaries)
        .set({
          label: input.label,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(companySubsidiaries.nodeId, input.nodeId),
            eq(companySubsidiaries.userId, ctx.user.id),
          ),
        )
        .returning();
    }),

  deleteSubsidiary: protectedProcedure
    .input(
      z.object({
        nodeId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(companySubsidiaries)
        .where(
          and(
            eq(companySubsidiaries.nodeId, input.nodeId),
            eq(companySubsidiaries.userId, ctx.user.id),
          ),
        );
    }),

  getSubsidiaries: protectedProcedure.query(async ({ ctx }) => {
    const subsidiaries = await ctx.db
      .select()
      .from(companySubsidiaries)
      .where(eq(companySubsidiaries.userId, ctx.user.id));

    return subsidiaries;
  }),

  getCompanyExpressions: protectedProcedure
    .input(
      z.object({
        offerType: z.string().optional(),
        isApproved: z.boolean(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.user;

      // Base where conditions
      const whereConditions = [
        eq(companyExpress.companyUserId, user.id),
        eq(companyExpress.isApproved, input.isApproved),
      ];

      // Add offer type filter if specified
      if (input.offerType) {
        whereConditions.push(eq(companyExpress.expressType, input.offerType));
      }

      // Get expressions with user details
      const expressions = await ctx.db
        .select({
          id: companyExpress.id,
          expressType: companyExpress.expressType,
          expressMessage: companyExpress.expressMessage,
          isApproved: companyExpress.isApproved,
          createdAt: companyExpress.createdAt,
          userName: individualUser.name,
          userPhoto: individualUser.photo,
          location: individualUser.fullAddress,
          role: usersTable.userType,
        })
        .from(companyExpress)
        .innerJoin(usersTable, eq(companyExpress.userId, usersTable.id))
        .innerJoin(
          individualUser,
          eq(companyExpress.userId, individualUser.userId),
        )
        .where(and(...whereConditions))
        .orderBy(desc(companyExpress.createdAt));

      // Get monthly stats with the same filters
      const monthlyStats = await ctx.db
        .select({
          month: sql<string>`date_trunc('month', ${companyExpress.createdAt})`,
          total: sql<number>`count(*)`,
          approved: sql<number>`count(*) filter (where ${companyExpress.isApproved} = true)`,
        })
        .from(companyExpress)
        .where(and(...whereConditions))
        .groupBy(sql`date_trunc('month', ${companyExpress.createdAt})`)
        .orderBy(sql`date_trunc('month', ${companyExpress.createdAt})`);

      return {
        expressions,
        monthlyStats: monthlyStats.map((stat) => ({
          ...stat,
          month: format(new Date(stat.month), "MMM"),
        })),
      };
    }),

  getCompanyEndorsements: protectedProcedure.query(async ({ ctx }) => {
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
      .where(eq(companyEndorse.companyUserId, ctx.user.id))
      .orderBy(desc(companyEndorse.createdAt));

    return endorsements;
  }),

  getInviteJourney: protectedProcedure.query(async ({ ctx }) => {
    // Get company details for initial node
    const companyDetails = await ctx.db
      .select({
        id: companyUser.userId,
        name: companyUser.companyName,
        logo: companyUser.photo,
      })
      .from(companyUser)
      .where(eq(companyUser.userId, ctx.user.id))
      .limit(1);

    // Get all invites and their connected users
    const invites = await ctx.db
      .select({
        id: companyInvites.id,
        inviteId: companyInvites.inviteId,
        parentInviteId: companyInvites.parentInviteId,
        email: companyInvites.email,
        phone: usersTable.phone,
        role: companyInvites.role,
        inviterId: companyInvites.inviterId,
        status: companyInvites.status,
        inviteLevel: companyInvites.inviteLevel,

        userId: individualUser.userId,
        userName: individualUser.name,
        userPhoto: individualUser.photo,
      })
      .from(companyInvites)
      .leftJoin(
        usersTable,
        or(
          eq(usersTable.email, companyInvites.email),
          eq(usersTable.phone, companyInvites.phoneNumber),
        ),
      )
      .leftJoin(individualUser, eq(individualUser.userId, usersTable.id))
      .where(
        and(
          eq(companyInvites.companyUserId, ctx.user.id),
          eq(companyInvites.status, "accepted"),
        ),
      );

    return {
      company: companyDetails[0],
      invites,
    };
  }),

  updateBusinessVerticalPhoto: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        photo: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(companyBusinessVertical)
        .set({ photo: input.photo })
        .where(eq(companyBusinessVertical.id, input.id));
    }),

  deleteDeck: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(companyDeck).where(eq(companyDeck.id, input.id));
    }),

  deleteFinDoc: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(companyFinancialDoc)
        .where(eq(companyFinancialDoc.id, input.id));
    }),

  deleteProduct: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(companyProducts)
        .where(eq(companyProducts.id, input.id));
    }),

  updateProductPhoto: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        photo: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(companyProducts)
        .set({ photo: input.photo })
        .where(eq(companyProducts.id, input.id));
    }),

  updateFinancialDocFile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        file: z.string().nullable(),
        fileName: z.string().nullable(),
        fileType: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(companyFinancialDoc)
        .set({
          file: input.file,
          fileName: input.fileName,
          fileType: input.fileType,
        })
        .where(eq(companyFinancialDoc.id, input.id));
    }),

  updateCorporateDeckFile: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        file: z.string().nullable(),
        fileName: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(companyDeck)
        .set({
          file: input.file,
          fileName: input.fileName,
        })
        .where(eq(companyDeck.id, input.id));
    }),

  getProfileSetup: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.user;

      if (!user) {
        throw new Error("User not found");
      }

      const companyProfile = await ctx.db
        .select({
          id: companyUser.id,
          phone: usersTable.phone,
          email: usersTable.email,
          userTableId: usersTable.id,
          userId: companyUser.userId,
          photo: companyUser.photo,
          companyName: companyUser.companyName,
          officePhone: companyUser.officePhone,
          registartionNumber: companyUser.registartionNumber,
          class: companyUser.class,
          listingStatus: companyUser.listingStatus,
          stage: companyUser.stage,
          yearOfIncorporation: companyUser.yearOfIncorporation,
          marketCapital: companyUser.marketCapital,
          sectors: companyUser.sectors,
          companyEmailID: companyUser.companyEmailID,
          companyWebsiteURL: companyUser.companyWebsiteURL,
          companyAddress: companyUser.companyAddress,
          about: companyUser.about,
          aboutTeam: companyUser.aboutTeam,
          keyEventUserId: companyKeyManagament.userId,
          keyPhoto: companyKeyManagament.photo,
          keyTeamStrength: companyKeyManagament.teamStrength,
          keyNameofTheMember: companyKeyManagament.nameOfTheMember,
          keyRole: companyKeyManagament.role,
          boardPhoto: companyBoardOfDirectors.photo,
          boardNameOfTheMember: companyBoardOfDirectors.nameOfTheMember,
          boardRole: companyBoardOfDirectors.role,
          businessPhoto: companyBusinessVertical.photo,
          businessName: companyBusinessVertical.nameOfTheBusinessVertical,
          businessAbout: companyBusinessVertical.about,
          deckFile: companyDeck.file,
          deckFileName: companyDeck.fileName,
          financialFile: companyFinancialDoc.file,
          financialFileName: companyFinancialDoc.fileName,
          productPhoto: companyProducts.photo,
          productType: companyProducts.productType,
          productName: companyProducts.nameOfTheProduct,
          productAbout: companyProducts.about,
        })
        .from(companyUser)
        .leftJoin(
          companyKeyManagament,
          eq(companyKeyManagament.userId, input.id),
        )
        .leftJoin(
          companyBoardOfDirectors,
          eq(companyBoardOfDirectors.userId, input.id),
        )
        .leftJoin(
          companyBusinessVertical,
          eq(companyBusinessVertical.userId, input.id),
        )
        .leftJoin(companyDeck, eq(companyDeck.userId, input.id))
        .leftJoin(companyFinancialDoc, eq(companyFinancialDoc.userId, input.id))
        .leftJoin(companyProducts, eq(companyProducts.userId, input.id))
        .leftJoin(usersTable, eq(usersTable.id, input.id))
        .where(eq(companyUser.userId, user.id));

      if (!companyProfile || companyProfile.length === 0) {
        return {
          company: null,
          completionPercentage: 0,
        };
      }

      const profilefilled = companyProfile[0];

      const profileFields: (keyof (typeof companyProfile)[0])[] = [
        "phone",
        "email",
        "photo",
        "companyName",
        "officePhone",
        "registartionNumber",
        "class",
        "listingStatus",
        "stage",
        "yearOfIncorporation",
        "marketCapital",
        "sectors",
        "companyEmailID",
        "companyWebsiteURL",
        "companyAddress",
        "about",
        "aboutTeam",
        "keyPhoto",
        "keyTeamStrength",
        "keyNameofTheMember",
        "keyRole",
        "boardNameOfTheMember",
        "boardRole",
        "businessPhoto",
        "businessName",
        "businessAbout",
        "deckFile",
        "deckFileName",
        "financialFile",
        "financialFileName",
        "productPhoto",
        "productName",
        "productAbout",
        "productType",
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
        company: companyProfile[0],
        completionPercentage: `${roundedPercentage}%`,
      };
    }),

  acceptInvite: publicProcedure
    .input(z.object({ inviteId: z.string() }))
    .mutation(async ({ input }) => {
      const { inviteId } = input;

      await db
        .update(companyInvites)
        .set({
          isUserApproved: true,
        })
        .where(eq(companyInvites.id, inviteId))
        .execute();

      return {
        success: true,
        message: "Invite Accpeted successfully",
      };
    }),

  declineInvite: publicProcedure
    .input(z.object({ inviteId: z.string() }))
    .mutation(async ({ input }) => {
      const { inviteId } = input;

      await db
        .update(companyInvites)
        .set({
          isUserdeclined: true,
        })
        .where(eq(companyInvites.id, inviteId))
        .execute();

      return {
        success: true,
        message: "Invite declined successfully",
      };
    }),
});

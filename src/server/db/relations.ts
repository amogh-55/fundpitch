import { relations } from "drizzle-orm";

import {
  companyUser,
  companyBoardOfDirectors,
  companyKeyManagament,
  companyBusinessVertical,
  companyDeck,
  companyProducts,
  companyFinancialDoc,
  companyInvites,
} from "./schema";

export const companyInviteRelations = relations(companyInvites, ({ one }) => ({
  companyUser: one(companyUser, {
    fields: [companyInvites.companyUserId],
    references: [companyUser.id],
  }),
  parentInvite: one(companyInvites, {
    fields: [companyInvites.parentInviteId],
    references: [companyInvites.id],
  }),
}));

export const companyBoardOfDirectorsRelations = relations(
  companyBoardOfDirectors,
  ({ one }) => ({
    companyUser: one(companyUser, {
      fields: [companyBoardOfDirectors.userId],
      references: [companyUser.id],
    }),
  }),
);

export const companyKeyManagamentRelations = relations(
  companyKeyManagament,
  ({ one }) => ({
    companyUser: one(companyUser, {
      fields: [companyKeyManagament.userId],
      references: [companyUser.id],
    }),
  }),
);

export const companyBusinessVerticalRelations = relations(
  companyBusinessVertical,
  ({ one }) => ({
    companyUser: one(companyUser, {
      fields: [companyBusinessVertical.userId],
      references: [companyUser.id],
    }),
  }),
);

export const companyDeckRelations = relations(companyDeck, ({ one }) => ({
  companyUser: one(companyUser, {
    fields: [companyDeck.userId],
    references: [companyUser.id],
  }),
}));

export const companyFinancialDocRelations = relations(
  companyFinancialDoc,
  ({ one }) => ({
    companyUser: one(companyUser, {
      fields: [companyFinancialDoc.userId],
      references: [companyUser.id],
    }),
  }),
);

export const companyProductsRelations = relations(
  companyProducts,
  ({ one }) => ({
    companyUser: one(companyUser, {
      fields: [companyProducts.userId],
      references: [companyUser.id],
    }),
  }),
);

export const companyUserRelations = relations(companyUser, ({ many }) => ({
  companyBoardOfDirectors: many(companyBoardOfDirectors),
  companyKeyManagament: many(companyKeyManagament),
  companyBusinessVertical: many(companyBusinessVertical),
  companyDeck: many(companyDeck),
  companyProducts: many(companyProducts),
  companyFinancialDoc: many(companyFinancialDoc),
}));

// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  text,
  timestamp,
  uuid,
  varchar,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `fundpitch_${name}`);

export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const usersTable = createTable("userTable", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  phone: text("phone").unique(),
  email: text("email").unique(),
  userType: text("userType"),
  userTypeChange: integer("userTypeChange").default(0),
  passwordHash: text("passwordHash"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const sessionsTable = createTable("sessions", {
  id: text("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const otpMessages = createTable("otp_messages", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  phone: text("phone_number"),
  email: text("email"),
  otp: integer("otp").notNull(),
  expireAt: timestamp("expire_at").defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const companyUser = createTable("companyUser", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => usersTable.id),
  photo: text("photo"),
  companyName: text("company_name"),
  officePhone: text("office_phone"),
  registartionNumber: text("registartion_Number"),
  class: text("class"),
  founderName: text("founder_name"),
  listingStatus: text("listingStatus"),
  stage: text("stage"),
  yearOfIncorporation: text("yearOfIncorporation"),
  marketCapital: text("marketCapital"),
  sectors: text("sectors"),
  companyEmailID: text("company_Email_ID"),
  companyWebsiteURL: text("company_Website_URL"),
  companyAddress: text("company_address"),
  about: text("about"),
  aboutTeam: text("about_Team"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  isApproved: boolean("is_approved").default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const companyInvites = createTable("companyInvites", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  inviterId: uuid("inviter_id")
    .notNull()
    .references(() => usersTable.id),
  companyUserId: uuid("company_user_id")
    .notNull()
    .references(() => companyUser.userId),
  parentInviteId: text("parent_invite_id"),
  email: text("email"),
  phoneNumber: text("phone_number"),
  inviteId: text("invite_id").unique().notNull(),
  role: text("role").notNull(),
  status: text("status").notNull(),
  isDirectCompanyInvite: boolean("is_direct_company_invite").default(false),
  isUserApproved: boolean("is_user_approved").default(false),
  isUserdeclined: boolean("is_user_declined").default(false),
  inviteLevel: integer("invite_level").notNull().default(0),
  mtalkzResponse: jsonb("mtalkz_response"),
  whatsappStatus: text("whatsapp_status"),
  whatsappError: text("whatsapp_error"),
  metaStatus: text("meta_status"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const companyExpress = createTable("companyExpress", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  expressType: text("express_type").notNull(),
  expressMessage: text("express_message").notNull(),
  isApproved: boolean("is_approved").default(false),
  companyUserId: uuid("company_user_id")
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const companyEndorse = createTable("companyEndorse", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  endorseMessage: text("endorse_message").notNull(),
  files: text("files").array(),
  audioFile: text("audio_file"),
  isApproved: boolean("is_approved").default(false),
  companyUserId: uuid("company_user_id")
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const companyEndroseFile = createTable("companyEndroseFile", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  endorseId: uuid("endorse_id")
    .notNull()
    .references(() => companyEndorse.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  file: text("file").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const companySubsidiaries = createTable("companySubsidiaries", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull(),
  nodeId: text("node_id").notNull(),
  label: text("label").notNull(),
  parentId: text("parent_id"),
  position: jsonb("position").$type<{ x: number; y: number }>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const companyBoardOfDirectors = createTable("companyBoardOfDirectors", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull(),
  photo: text("photo"),
  nameOfTheMember: text("nameOfTheMember"),
  role: text("role"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});
export const companyKeyManagament = createTable("companyKeyManagament", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull(),
  photo: text("photo"),
  teamStrength: text("teamStrength"),
  nameOfTheMember: text("nameOfTheMember"),
  order: integer("order").default(0),
  role: text("role"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const companyBusinessVertical = createTable("companyBusinessVertical", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull(),
  photo: text("photo"),
  nameOfTheBusinessVertical: text("nameOfTheBusinessVertical"),
  about: text("about"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const companyDeck = createTable("companyDeck", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull(),
  file: text("file"),
  fileName: text("fileName"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const companyFinancialDoc = createTable("companyFinancialDoc", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull(),
  file: text("file"),
  fileName: text("fileName"),
  fileType: text("fileType"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const companyProducts = createTable("companyProducts", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id").notNull(),
  photo: text("photo"),
  nameOfTheProduct: text("nameOfTheProduct"),
  productType: text("productType"),
  about: text("about"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const individualDocuments = createTable("individualDocuments", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  file: text("file"),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const individualUser = createTable("individualUser", {
  id: uuid("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  photo: text("photo"),
  name: text("name"),
  designation: text("designation"),
  contactNumber: text("contactNumber"),
  email: text("email"),
  fullAddress: text("fullAddress"),
  bio: text("bio"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const userTypeChangeRequests = createTable("userTypeChangeRequests", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  currentType: text("current_type").notNull(),
  requestedType: text("requested_type").notNull(),
  madeBy: uuid("made_by"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  adminComment: text("admin_comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

CREATE TABLE IF NOT EXISTS "fundpitch_companyBoardOfDirectors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"photo" text,
	"nameOfTheMember" text,
	"role" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_companyBusinessVertical" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"photo" text,
	"nameOfTheBusinessVertical" text,
	"about" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_companyDeck" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"file" text,
	"fileName" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_companyEndorse" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"endorse_message" text NOT NULL,
	"files" text[],
	"audio_file" text,
	"is_approved" boolean DEFAULT false,
	"company_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_companyEndroseFile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"endorse_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"file" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_companyExpress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"express_type" text NOT NULL,
	"express_message" text NOT NULL,
	"is_approved" boolean DEFAULT false,
	"company_user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_companyFinancialDoc" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"file" text,
	"fileName" text,
	"fileType" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_companyInvites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inviter_id" uuid NOT NULL,
	"company_user_id" uuid NOT NULL,
	"parent_invite_id" uuid,
	"email" text,
	"phone_number" text,
	"invite_id" text NOT NULL,
	"role" text NOT NULL,
	"status" text NOT NULL,
	"is_direct_company_invite" boolean DEFAULT false,
	"is_user_approved" boolean DEFAULT false,
	"invite_level" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "fundpitch_companyInvites_invite_id_unique" UNIQUE("invite_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_companyKeyManagament" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"photo" text,
	"teamStrength" text,
	"nameOfTheMember" text,
	"role" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_companyProducts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"photo" text,
	"nameOfTheProduct" text,
	"productType" text,
	"about" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_companySubsidiaries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"node_id" text NOT NULL,
	"label" text NOT NULL,
	"parent_id" text,
	"position" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_companyUser" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"photo" text,
	"company_name" text,
	"office_phone" text,
	"registartion_Number" text,
	"class" text,
	"listingStatus" text,
	"stage" text,
	"yearOfIncorporation" text,
	"marketCapital" text,
	"sectors" text,
	"company_Email_ID" text,
	"company_Website_URL" text,
	"company_address" text,
	"about" text,
	"about_Team" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"is_approved" boolean DEFAULT false,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "fundpitch_companyUser_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_individualDocuments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"file" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_individualUser" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"photo" text,
	"name" text,
	"designation" text,
	"contactNumber" text,
	"email" text,
	"fullAddress" text,
	"bio" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_otp_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone_number" text,
	"email" text,
	"otp" integer NOT NULL,
	"expire_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_post" (
	"id" integer PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY (sequence name "fundpitch_post_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(256),
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_userTypeChangeRequests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"current_type" text NOT NULL,
	"requested_type" text NOT NULL,
	"made_by" uuid NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"admin_comment" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "fundpitch_userTable" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"phone" text,
	"email" text,
	"userType" text,
	"userTypeChange" integer DEFAULT 0,
	"passwordHash" text,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "fundpitch_userTable_phone_unique" UNIQUE("phone"),
	CONSTRAINT "fundpitch_userTable_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fundpitch_companyEndorse" ADD CONSTRAINT "fundpitch_companyEndorse_user_id_fundpitch_userTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."fundpitch_userTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fundpitch_companyEndorse" ADD CONSTRAINT "fundpitch_companyEndorse_company_user_id_fundpitch_userTable_id_fk" FOREIGN KEY ("company_user_id") REFERENCES "public"."fundpitch_userTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fundpitch_companyEndroseFile" ADD CONSTRAINT "fundpitch_companyEndroseFile_endorse_id_fundpitch_companyEndorse_id_fk" FOREIGN KEY ("endorse_id") REFERENCES "public"."fundpitch_companyEndorse"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fundpitch_companyEndroseFile" ADD CONSTRAINT "fundpitch_companyEndroseFile_user_id_fundpitch_userTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."fundpitch_userTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fundpitch_companyExpress" ADD CONSTRAINT "fundpitch_companyExpress_user_id_fundpitch_userTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."fundpitch_userTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fundpitch_companyExpress" ADD CONSTRAINT "fundpitch_companyExpress_company_user_id_fundpitch_userTable_id_fk" FOREIGN KEY ("company_user_id") REFERENCES "public"."fundpitch_userTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fundpitch_companyInvites" ADD CONSTRAINT "fundpitch_companyInvites_inviter_id_fundpitch_userTable_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "public"."fundpitch_userTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fundpitch_companyInvites" ADD CONSTRAINT "fundpitch_companyInvites_company_user_id_fundpitch_companyUser_user_id_fk" FOREIGN KEY ("company_user_id") REFERENCES "public"."fundpitch_companyUser"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fundpitch_companyUser" ADD CONSTRAINT "fundpitch_companyUser_user_id_fundpitch_userTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."fundpitch_userTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fundpitch_individualDocuments" ADD CONSTRAINT "fundpitch_individualDocuments_user_id_fundpitch_userTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."fundpitch_userTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fundpitch_individualUser" ADD CONSTRAINT "fundpitch_individualUser_user_id_fundpitch_userTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."fundpitch_userTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fundpitch_sessions" ADD CONSTRAINT "fundpitch_sessions_user_id_fundpitch_userTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."fundpitch_userTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fundpitch_userTypeChangeRequests" ADD CONSTRAINT "fundpitch_userTypeChangeRequests_user_id_fundpitch_userTable_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."fundpitch_userTable"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "name_idx" ON "fundpitch_post" USING btree ("name");
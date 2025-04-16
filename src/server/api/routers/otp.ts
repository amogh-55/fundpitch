import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { otpMessages, usersTable } from "@/server/db/schema";
import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import axios from "axios";
import { TRPCError } from "@trpc/server";
import emailTransport from "@/server/email-transport";

export const otpRouter = createTRPCRouter({
  sendPhoneOtp: publicProcedure
    .input(z.object({ phone: z.string() }))
    .mutation(async ({ input }) => {
      const [existingUser] = await Promise.all([
        db.query.usersTable.findFirst({
          where: eq(usersTable.phone, input.phone),
        }),
      ]);

      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Phone number already registered",
        });
      }

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
      const existingUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.email, input.email),
      });

      if (existingUser) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email already registered",
        });
      }

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

  verifyEmailOtp: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        otp: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const otpRecord = await db.query.otpMessages.findFirst({
          where: (messages, { eq, and, gt }) =>
            and(
              eq(messages.email, input.email),
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

        if (otpRecord.otp !== parseInt(input.otp)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid OTP",
          });
        }
      } catch (error) {
        console.log({ error });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to verify email OTP",
        });
      }
    }),

  verifyPhoneOtp: publicProcedure
    .input(
      z.object({
        phone: z.string(),
        otp: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
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

        if (otpRecord.otp !== parseInt(input.otp)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid OTP",
          });
        }
      } catch (error) {
        console.log({ error });
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to verify phone OTP",
        });
      }
    }),
});

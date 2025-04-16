import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    CLOUDFLARE_R2_ACCESS_KEY_ID: z.string(),
    CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string(),
    CLOUDFLARE_R2_ENDPOINT: z.string(),
    MTALKZ_API_KEY: z.string(),
    BREVO_USER: z.string(),
    BREVO_PASSWORD: z.string(),
    SES_USER: z.string(),
    SES_PASSWORD: z.string(),
    WAP_SENDER_PHONE: z.string(),
    WAP_SENDER_NAME: z.string(),
    WAP_KEY: z.string(),
    WAP_URL: z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */

  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLOUDFLARE_R2_ACCESS_KEY_ID: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    CLOUDFLARE_R2_SECRET_ACCESS_KEY:
      process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    CLOUDFLARE_R2_ENDPOINT: process.env.CLOUDFLARE_R2_ENDPOINT,
    MTALKZ_API_KEY: process.env.MTALKZ_API_KEY,
    BREVO_USER: process.env.BREVO_USER,
    BREVO_PASSWORD: process.env.BREVO_PASSWORD,
    SES_USER: process.env.SES_USER,
    SES_PASSWORD: process.env.SES_PASSWORD,
    WAP_SENDER_PHONE: process.env.WAP_SENDER_PHONE,
    WAP_SENDER_NAME: process.env.WAP_SENDER_NAME,
    WAP_KEY: process.env.WAP_KEY,
    WAP_URL: process.env.WAP_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});

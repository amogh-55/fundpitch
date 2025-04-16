import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { otpRouter } from "./routers/otp";
import { userRouter } from "./routers/user";
import { companyRouter } from "./routers/company";
import { individualRouter } from "./routers/individual";
import { adminRouter } from "./routers/admin";
import { inviteRouter } from "./routers/invite";
import { companyNotificationRouter } from "./routers/company-notification";
import { overViewProfileRouter } from "./routers/over-view-profile";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  otp: otpRouter,
  user: userRouter,
  company: companyRouter,
  individual: individualRouter,
  admin: adminRouter,
  invite: inviteRouter,
  companyNotification: companyNotificationRouter,
  overViewProfile: overViewProfileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({ debug: true });

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // Don't run middleware on static files
    "/", // Run middleware on index page
    "/(api|trpc)(.*)",
  ], // Run middleware on API routes
};

// import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
// import { NextRequest } from "next/server";
// import createMiddleware from "next-intl/middleware";

// // const localePrefix: LocalePrefix = "as-needed";
// const AppConfig = {
//   name: "Nextjs Starter",
//   locales: ["en", "fr"],
//   defaultLocale: "en",
//   // localePrefix,
// };

// const intlMiddleware = createMiddleware({
//   locales: AppConfig.locales,
//   // localePrefix: AppConfig.localePrefix,
//   defaultLocale: AppConfig.defaultLocale,
// });

// export default authMiddleware({
//   publicRoutes: (req: NextRequest) => !req.nextUrl.pathname.includes("/"),

//   beforeAuth: (req) => {
//     // Execute next-intl middleware before Clerk's auth middleware
//     return intlMiddleware(req);
//   },

//   // eslint-disable-next-line consistent-return
//   afterAuth(auth, req) {
//     // Handle users who aren't authenticated
//     if (!auth.userId && !auth.isPublicRoute) {
//       return redirectToSignIn({ returnBackUrl: req.url });
//     }
//   },
// });

// // export default authMiddleware({
// //   publicRoutes: [
// //     "/api/webhooks(.*)",
// //     "/",
// //     "/events/:id",
// //     "/api/webhook/clerk",
// //     "/api/webhook/stripe",
// //     "/api/uploadthing",
// //   ],
// //   ignoredRoutes: [
// //     "/api/webhook/clerk",
// //     "/api/webhook/stripe",
// //     "/api/uploadthing",
// //   ],
// // });

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

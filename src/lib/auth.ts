import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { expo } from "@better-auth/expo";
import { anonymous, haveIBeenPwned } from "better-auth/plugins";

const prisma = new PrismaClient();

export const auth = betterAuth({
  trustedOrigins: ["local://", "exp://"],
  basePath: "/v1/auth",
  plugins: [expo() as any, anonymous(), haveIBeenPwned()],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, 
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID!, 
      clientSecret: process.env.APPLE_CLIENT_SECRET!, 
      //appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER!, Needed in the future when setting up apple login
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID!, 
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!, 
    },
  },
});

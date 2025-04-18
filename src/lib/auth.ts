import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "./generated/prisma/index.js";

const prisma = new PrismaClient();

export const auth = betterAuth({
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
      //appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER!, 
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID!, 
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!, 
    },
  },
});

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../generated/client";
import { expo } from "@better-auth/expo";
import {
  anonymous,
  createAuthMiddleware,
  haveIBeenPwned,
  twoFactor,
} from "better-auth/plugins";
import { encodeImageToBlurhash } from "./util/image";

const prisma = new PrismaClient();

export const auth = betterAuth({
  trustedOrigins: ["local://", "exp://"],
  basePath: "/v1/auth",
  appName: "Local",
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60,
    },
  },
  plugins: [
    expo(),
    anonymous(),
    haveIBeenPwned({
      customPasswordCompromisedMessage:
        "Ihr Passwort wurde in einem Datenleck gefunden. Bitte wählen Sie ein anderes.",
    }),
    twoFactor(),
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: Bun.env.GOOGLE_CLIENT_ID,
      clientSecret: Bun.env.GOOGLE_CLIENT_SECRET,
    },
    apple: {
      clientId: Bun.env.APPLE_CLIENT_ID,
      clientSecret: Bun.env.APPLE_CLIENT_SECRET,
      //appBundleIdentifier: Bun.env.APPLE_APP_BUNDLE_IDENTIFIER!, Needed in the future when setting up apple login
    },
    facebook: {
      clientId: Bun.env.FACEBOOK_CLIENT_ID,
      clientSecret: Bun.env.FACEBOOK_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      isContractor: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      imageHash: {
        type: "string",
        required: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          console.log("Creating user:", user);
          if (user.image) {
            const imageHash = await encodeImageToBlurhash(user.image);
            return {
              data: {
                ...user,
                imageHash,
              },
            };
          }
          // If no image, just return the user as is
          return {
            data: user,
          };
        },
      },
    },
  },
});

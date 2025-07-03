import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../generated/client";
import { expo } from "@better-auth/expo";
import {
  anonymous,
  haveIBeenPwned,
  twoFactor,
  emailOTP,
  admin,
} from "better-auth/plugins";
import { encodeImageToBlurhash } from "./util/image";
import { sendVerificationEmail } from "./emails/verify";
import { trustedOrigins } from "./util/constants";
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();

export const auth = betterAuth({
  trustedOrigins,
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
    admin(),
    anonymous(),
    haveIBeenPwned({
      customPasswordCompromisedMessage:
        "Ihr Passwort wurde in einem Datenleck gefunden. Bitte wählen Sie ein anderes.",
    }),
    twoFactor(),
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await sendVerificationEmail({
          userEmail: email,
          otp: otp,
        });
      },
    }),
    nextCookies(),
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

declare module "bun" {
    interface Env {
      PORT: number;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
      APPLE_CLIENT_ID: string;
      APPLE_CLIENT_SECRET: string;
      APPLE_APP_BUNDLE_IDENTIFIER: string;
      FACEBOOK_CLIENT_ID: string;
      FACEBOOK_CLIENT_SECRET: string;
      DATABASE_URL: string;
      RESEND_API_KEY: string;
    }
  }
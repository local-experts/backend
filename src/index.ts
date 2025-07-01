import { Hono, type Context } from "hono";
import { auth } from "./lib/auth";
import Random from "./routes/random";
import { cors } from "hono/cors";
import { trustedOrigins } from "./lib/util/constants";

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

const app = new Hono();
const v1 = new Hono();

app.use("*", cors({
  origin: trustedOrigins,
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["POST", "GET", "DELETE", "PUT", "OPTIONS"],
  exposeHeaders: ["Content-Length"],
  maxAge: 600,
  credentials: true,
}),);

v1.get("/ping", (c) => {
  return c.json("pong!");
});

v1.on(["POST", "GET"], "auth/**", (c) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
  return auth.handler(c.req.raw);
});

v1.get("/random", (c: Context) => {
  return c.json(Random());
});

app.route("/v1", v1);

export default {
  port: Bun.env.PORT ? Bun.env.PORT : 3000,
  fetch: app.fetch,
};

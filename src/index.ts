import { Hono } from "hono";
import { auth } from "./lib/auth";
import { cors } from "hono/cors";
import { trustedOrigins } from "./lib/util/constants";
import { createFileBasedRouter } from "./lib/fileBasedRouting";

const app = new Hono();
const v1 = new Hono();

app.use(
  "*",
  cors({
    origin: trustedOrigins,
    allowHeaders: ["Content-Type", "Authorization", "Cookie"],
    allowMethods: ["POST", "GET", "DELETE", "PUT", "PATCH", "OPTIONS"],
    exposeHeaders: ["Content-Length", "Authorization"],
    maxAge: 600,
    credentials: true,
  })
);

v1.on(["POST", "GET"], "auth/**", (c) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
  return auth.handler(c.req.raw);
});

const initializeRoutes = async () => {
  try {
    const routes = await createFileBasedRouter("./src/routes");

    routes.registerRoutes(v1);

  } catch (error) {
    console.error("Error initializing file-based routing:", error);
  }
};

await initializeRoutes();

const initializeRoutes = async () => {
  try {
    const routes = await createFileBasedRouter("./src/api");

    routes.registerRoutes(v1);

  } catch (error) {
    console.error("Error initializing file-based routing:", error);
  }
};

await initializeRoutes();

app.route("/v1", v1);

export default {
  port: Bun.env.PORT ? Bun.env.PORT : 3000,
  fetch: app.fetch,
};

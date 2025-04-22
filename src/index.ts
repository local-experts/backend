import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";
import { auth } from "./lib/auth.js";

const app = new Hono();
const v1 = new Hono();

v1.get("/ping", (c) => {
  return c.json("pong!");
});

v1.on(["POST", "GET"], "api/auth/**", (c) => {
  console.log(`[${new Date().toISOString()}] ${c.req.method} ${c.req.url}`);
  return auth.handler(c.req.raw);
});

app.route("/v1", v1);

serve(
  {
    fetch: app.fetch,
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

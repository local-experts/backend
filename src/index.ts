import { serve } from "@hono/node-server";
import { Hono } from "hono";
import "dotenv/config";

const app = new Hono();

app.get("/ping", (c) => {
  return c.json("pong!");
});

serve(
  {
    fetch: app.fetch,
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

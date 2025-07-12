import type { Context } from "hono";

export const get = async (c: Context) => {
  return c.json({ message: "pong" });
};

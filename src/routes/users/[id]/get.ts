import type { Context } from "hono";

export const get = async (c: Context) => {
  const id = c.req.param("id");
  
  if (!id) {
    return c.json({ error: "User ID is required" }, 400);
  }

  const user = {
    id,
    name: "John Doe",
    email: "john@example.com",
    createdAt: new Date(),
  };
  
  return c.json({ user });
}; 
import type { Context } from "hono";

export const get = async (c: Context) => {
  const users = [
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
  ];
  
  return c.json({ users });
}; 
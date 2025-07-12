import type { Context, Hono } from "hono";
import { readdir } from "node:fs/promises";
import { join } from "path";

interface RouteHandler {
  get?: (c: Context) => Promise<Response> | Response;
  post?: (c: Context) => Promise<Response> | Response;
  put?: (c: Context) => Promise<Response> | Response;
  delete?: (c: Context) => Promise<Response> | Response;
  patch?: (c: Context) => Promise<Response> | Response;
}

interface RouteConfig {
  path: string;
  handlers: RouteHandler;
}

export class FileBasedRouter {
  private routes: RouteConfig[] = [];
  private basePath: string;

  constructor(basePath: string = "./src/api") {
    this.basePath = basePath;
  }

  async discoverRoutes(): Promise<void> {
    this.routes = [];
    await this.scanDirectory(this.basePath, "");
  }

  private async scanDirectory(fullPath: string, relativePath: string): Promise<void> {
    try {
      const items = await readdir(fullPath, { withFileTypes: true });
      
      for (const item of items) {
        const itemPath = join(fullPath, item.name);
        
        if (item.isDirectory()) {
          const newRelativePath = path.posix.join(relativePath, item.name);
          await this.scanDirectory(itemPath, newRelativePath);
        } else if (item.name === "index.ts") {
          await this.loadRouteHandlers(fullPath, relativePath);
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${fullPath}:`, error);
    }
  }

  private async loadRouteHandlers(dirPath: string, routePath: string): Promise<void> {
    try {
      const indexPath = join(dirPath, "index.ts");
      
      const indexFile = Bun.file(indexPath);
      const exists = await indexFile.exists();
      
      if (!exists) {
        console.warn(`Index file not found: ${indexPath}`);
        return;
      }
      
      const absolutePath = `file://${process.cwd()}/${indexPath}`;
      const handlers = await import(absolutePath);

      const routeConfig: RouteConfig = {
        path: routePath || "/",
        handlers: {
          get: handlers.get,
          post: handlers.post,
          put: handlers.put,
          delete: handlers.delete,
          patch: handlers.patch,
        },
      };

      this.routes.push(routeConfig);
    } catch (error) {
      console.error(`Error loading handlers from ${dirPath}:`, error);
    }
  }

  registerRoutes(app: Hono): void {
    for (const route of this.routes) {
      const honoPath = `/api${route.path}`.replace(/\[(\w+)\]/g, ':$1');

      if (route.handlers.get) {
        app.get(honoPath, route.handlers.get);
        console.log(`Registered GET ${honoPath}`);
      }
      
      if (route.handlers.post) {
        app.post(honoPath, route.handlers.post);
        console.log(`Registered POST ${honoPath}`);
      }
      
      if (route.handlers.put) {
        app.put(honoPath, route.handlers.put);
        console.log(`Registered PUT ${honoPath}`);
      }
      
      if (route.handlers.delete) {
        app.delete(honoPath, route.handlers.delete);
        console.log(`Registered DELETE ${honoPath}`);
      }
      
      if (route.handlers.patch) {
        app.patch(honoPath, route.handlers.patch);
        console.log(`Registered PATCH ${honoPath}`);
      }
    }
  }

  getRoutes(): RouteConfig[] {
    return this.routes;
  }
}

export async function createFileBasedRouter(basePath?: string): Promise<FileBasedRouter> {
  const router = new FileBasedRouter(basePath);
  await router.discoverRoutes();
  return router;
} 
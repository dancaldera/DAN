type Handler = (request: Request) => Promise<Response> | Response;

export class Router {
  private routes: Map<string, Handler> = new Map();
  private middlewares: Handler[] = [];
  private subRouters: Router[] = [];

  private corsHeaders = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });

  use(handler: Handler | Router): void {
    if (handler instanceof Router) {
      this.subRouters.push(handler);
    } else {
      this.middlewares.push(handler);
    }
  }

  get(path: string, handler: Handler): void {
    this.routes.set(`GET:${path}`, handler);
  }

  post(path: string, handler: Handler): void {
    this.routes.set(`POST:${path}`, handler);
  }

  put(path: string, handler: Handler): void {
    this.routes.set(`PUT:${path}`, handler);
  }

  delete(path: string, handler: Handler): void {
    this.routes.set(`DELETE:${path}`, handler);
  }

  async handle(request: Request): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: this.corsHeaders });
    }

    try {
      // Run middlewares
      for (const middleware of this.middlewares) {
        await middleware(request);
      }

      // Try to route with this router first
      const response = await this.route(request);
      if (response.status !== 404) {
        this.corsHeaders.forEach((value, key) => {
          response.headers.set(key, value);
        });
        return response;
      }

      // Try sub-routers
      for (const subRouter of this.subRouters) {
        const subResponse = await subRouter.handle(request);
        if (subResponse.status !== 404) {
          return subResponse;
        }
      }

      return new Response("Not Found", { status: 404 });
    } catch (error) {
      console.error("Router error:", error);
      return new Response(
        JSON.stringify({ error: "Internal Server Error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...this.corsHeaders },
        }
      );
    }
  }

  private async route(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const pathname = url.pathname;
    
    // Try exact match first
    const exactKey = `${method}:${pathname}`;
    const exactHandler = this.routes.get(exactKey);
    
    if (exactHandler) {
      return await exactHandler(request);
    }
    
    // Try pattern matching for dynamic routes
    for (const [routeKey, handler] of this.routes.entries()) {
      const [routeMethod, ...routePathParts] = routeKey.split(':');
      const routePath = routePathParts.join(':');
      
      if (routeMethod !== method) continue;
      
      // Simple pattern matching for :id routes
      if (routePath.includes(':')) {
        const routeParts = routePath.split('/');
        const pathParts = pathname.split('/');
        
        if (routeParts.length === pathParts.length) {
          let matches = true;
          for (let i = 0; i < routeParts.length; i++) {
            if (routeParts[i].startsWith(':')) {
              continue; // This is a parameter, skip matching
            }
            if (routeParts[i] !== pathParts[i]) {
              matches = false;
              break;
            }
          }
          
          if (matches) {
            return await handler(request);
          }
        }
      }
    }

    return new Response("Not Found", { status: 404 });
  }
}
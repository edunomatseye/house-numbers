import {
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import Root from "./routes/__root";
import Index from "./routes/index";

// Create a root route
const rootRoute = createRootRoute({
  component: Root,
});

// Create an index route (main page)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Index,
});

// Create the router instance
export const router = createRouter({
  routeTree: rootRoute.addChildren([indexRoute]),
});

// Register your router for maximum type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

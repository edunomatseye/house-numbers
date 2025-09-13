import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanstackDevtools } from "@tanstack/react-devtools";
import type { ReactNode } from "react";

export const Route = createRootRouteWithContext<{
  db: {
    age: number;
    name: string;
    city: string;
    country: string;
    isMarried: boolean;
    hobbies: string[];
  };
  query: { getAge: () => number };
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Start Starter",
      },
    ],
  }),
  loader(ctx) {
    const age = ctx.context.db.age;
    return {
      age,
    };
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <div>Age: {Route.useLoaderData().age}</div>
      <Outlet />
      <TanstackDevtools
        config={{
          position: "bottom-left",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

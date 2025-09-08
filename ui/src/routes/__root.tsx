import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanstackDevtools } from "@tanstack/react-devtools";

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
  loader(ctx) {
    const age = ctx.context.db.age;
    return {
      age,
    };
  },
  component: () => {
    const { age } = Route.useLoaderData();
    return (
      <>
        <div>Age: {age}</div>
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
      </>
    );
  },
});

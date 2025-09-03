import { authClient, signOut } from "@/lib/auth-client";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { data, isPending, error } = authClient.useSession();
  if (isPending) {
    return <>Loading...</>;
  }
  if (error) {
    return <>Error: {error.message}</>;
  }
  if (data) {
    return (
      <>
        Signed in as {data.user.name} <br />
        Kindly click on the button below to sign out <br />
        <Button
          onClick={() => {
            signOut();
            navigate({ to: "/sign-in" });
          }}
        >
          Sign Out
        </Button>
      </>
    );
  }
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <>
      <div className="p-2 flex gap-2">{/* Navigation could go here */}</div>
      <hr />
      <div className="p-2">About Route</div>
    </>
  );
}

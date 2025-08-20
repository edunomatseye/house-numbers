import { Outlet } from "@tanstack/react-router";

function Root() {
  return (
    <>
      <div className="p-2 flex gap-2">{/* Navigation could go here */}</div>
      <hr />
      <div className="p-2">
        <Outlet /> {/* Renders the matched route's component */}
      </div>
    </>
  );
}

export default Root;

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_unauthenticated")({
  component: RouteComponent,
  loader: () => {
    if (localStorage.getItem("userProfile")) throw redirect({ to: "/" });
  },
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

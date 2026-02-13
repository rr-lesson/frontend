import { jotaiStore, navbarTitleAtom } from "@/stores";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_home/settings/")({
  component: RouteComponent,
  onEnter: () => {
    jotaiStore.set(navbarTitleAtom, "Pengaturan");
  },
});

function RouteComponent() {
  return <div>Hello "/_authenticated/_home/settings/"!</div>;
}

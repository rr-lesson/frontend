import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/questions/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Button asChild>
        <Link to="/questions/create">
          <PlusIcon />
          Ajukan pertanyaan baru
        </Link>
      </Button>
      <p>Hello "/_authenticated/questions/"!</p>
    </div>
  );
}

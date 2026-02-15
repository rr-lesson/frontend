import { getAllQuestionsOptions } from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { jotaiStore, navbarTitleAtom } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { generateText } from "@tiptap/core";
import Mathematics from "@tiptap/extension-mathematics";
import StarterKit from "@tiptap/starter-kit";
import { format } from "date-fns";
import {
  CalendarIcon,
  FilesIcon,
  MoveRightIcon,
  PlusIcon,
  SearchIcon,
  UserIcon,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/_home/questions/")({
  component: RouteComponent,
  onEnter: () => {
    jotaiStore.set(navbarTitleAtom, "Ruang Tanya");
  },
});

function RouteComponent() {
  const { data: dataQuestions } = useQuery({
    ...getAllQuestionsOptions({
      query: {
        includes: ["user", "subject", "class"],
      },
    }),
  });

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center gap-2 sticky top-20">
        <Input
          placeholder="Cari pertanyaan..."
          className="bg-background/70 backdrop-blur-md"
        />
        <Button size={"icon"}>
          <SearchIcon />
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {dataQuestions &&
          dataQuestions.items.map((item, index) => (
            <Card key={"question-item-" + index} className="shadow-none">
              <CardHeader className="flex items-center gap-3">
                <div className="flex items-center justify-center size-10 bg-primary/10 rounded-full">
                  <UserIcon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {item.user.name ?? "Anonim"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.subject.name} • {item.class.name}
                  </p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {generateText(JSON.parse(item.data.question), [
                    StarterKit,
                    Mathematics,
                  ])}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between items-end">
                <div className="space-y-1">
                  <div className="flex items-center text-muted-foreground text-xs gap-2">
                    <CalendarIcon className="size-3" />
                    <p>{format(item.data.created_at, "EEEE, d MMMM yyyy")}</p>
                  </div>
                  <div className="flex items-center text-muted-foreground text-xs gap-2">
                    <FilesIcon className="size-3" />
                    <p>2 gambar disertakan</p>
                  </div>
                </div>
                <Button size={"icon"} variant={"secondary"} asChild>
                  <Link
                    to="/questions/$questionId"
                    params={{ questionId: String(item.data.id) }}
                  >
                    <MoveRightIcon />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      {/* spacer */}
      <div>
        <div className="h-32"></div>
        <div className="h-[env(safe-area-inset-bottom)]"></div>
      </div>

      <Button
        className="size-14 fixed bottom-[env(safe-area-inset-bottom)] mb-24 md:mb-4 right-4 rounded-xl shadow-xl"
        asChild
      >
        <Link to="/questions/create">
          <PlusIcon className="size-5" />
        </Link>
      </Button>
    </div>
  );
}

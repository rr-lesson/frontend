import { getAllQuestionsOptions } from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import Mathematics from "@tiptap/extension-mathematics";
import { generateText } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { format } from "date-fns";
import { CalendarIcon, FilesIcon, MoveRightIcon, UserIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/me/questions")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: dataQuestions } = useQuery({
    ...getAllQuestionsOptions({
      query: {
        includes: ["user", "attachments", "class", "subject"],
        owned: true,
      },
    }),
  });

  return (
    <>
      <div className="py-4">
        <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
          {dataQuestions &&
            dataQuestions.items.map((item, index) => (
              <Card
                key={"question-item-" + index}
                className="shadow-none py-4 gap-4"
              >
                <CardHeader className="flex items-center gap-3 px-4">
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
                <CardContent className="px-4">
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {generateText(JSON.parse(item.data.question), [
                      StarterKit,
                      Mathematics,
                    ])}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-end px-4 h-full">
                  <div className="space-y-1">
                    <div className="flex items-center text-muted-foreground text-xs gap-2">
                      <CalendarIcon className="size-3" />
                      <p>{format(item.data.created_at, "EEEE, d MMMM yyyy")}</p>
                    </div>
                    {item.attachments.length > 0 && (
                      <div className="flex items-center text-muted-foreground text-xs gap-2">
                        <FilesIcon className="size-3" />
                        <p>{item.attachments.length} gambar disertakan</p>
                      </div>
                    )}
                  </div>
                  <Button
                    size={"icon"}
                    variant={"secondary"}
                    asChild
                    className="pointer-events-auto"
                  >
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
      </div>
    </>
  );
}

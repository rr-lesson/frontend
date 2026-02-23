import { getAllQuestionsOptions } from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useDebounce } from "@/hooks/use-debounce";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
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
  XIcon,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/_home/questions")({
  component: RouteComponent,
  onEnter: () => {
    jotaiStore.set(navbarTitleAtom, "Ruang Tanya");
  },
});

function RouteComponent() {
  const isMobile = useIsMobile();
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 500);

  const { data: dataQuestions, isLoading: isLoadingQuestions } = useQuery({
    ...getAllQuestionsOptions({
      query: {
        includes: ["user", "subject", "class", "attachments"],
        keyword: debouncedKeyword,
      },
    }),
  });

  return (
    <>
      <div className="space-y-4 py-4">
        <div className="flex items-center gap-2 sticky top-20">
          <Input
            placeholder="Cari pertanyaan..."
            className="bg-background/70 backdrop-blur-md"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword && (
            <Button
              size={"icon"}
              variant={"secondary"}
              onClick={() => setKeyword("")}
              disabled={isLoadingQuestions}
            >
              <XIcon />
            </Button>
          )}
          <Button size={"icon"} disabled={isLoadingQuestions}>
            {isLoadingQuestions ? <Spinner /> : <SearchIcon />}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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

        {/* spacer */}
        <div>
          <div className={cn(isMobile ? "h-36" : "h-16")}></div>
          <div className="h-[env(safe-area-inset-bottom)]"></div>
        </div>
      </div>

      <div
        className={cn(
          isMobile ? "w-[calc(100%-18rem)] mb-20" : "w-[calc(100%-16rem)]",
          "bottom-[env(safe-area-inset-bottom)] fixed right-0 pointer-events-none",
        )}
      >
        <div className="max-w-5xl w-full mx-auto px-4 pointer-events-none flex justify-end">
          <Button
            className="pointer-events-auto size-14 rounded-xl my-4"
            asChild
          >
            <Link to="/questions/create">
              <PlusIcon />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}

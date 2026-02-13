import { getAllQuestionsOptions } from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { jotaiStore, navbarTitleAtom } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { generateText } from "@tiptap/core";
import Mathematics from "@tiptap/extension-mathematics";
import StarterKit from "@tiptap/starter-kit";
import { ChevronRightIcon, PlusIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/questions/")({
  component: RouteComponent,
  onEnter: () => {
    jotaiStore.set(navbarTitleAtom, "Ruang Tanya");
  },
});

function RouteComponent() {
  const { data: dataQuestions } = useQuery({
    ...getAllQuestionsOptions(),
  });

  return (
    <div>
      <Button asChild>
        <Link to="/questions/create">
          <PlusIcon />
          Ajukan pertanyaan baru
        </Link>
      </Button>
      <div>
        {dataQuestions &&
          dataQuestions.questions.map((item, index) => (
            <Card key={"question-item-" + index}>
              <CardHeader>
                <CardTitle>
                  {generateText(JSON.parse(item.question), [
                    StarterKit,
                    Mathematics,
                  ])}
                </CardTitle>
              </CardHeader>
              <CardFooter className="justify-end">
                <Button variant={"outline"} asChild>
                  <Link
                    to="/questions/$questionId"
                    params={{ questionId: String(item.id) }}
                  >
                    Lihat
                    <ChevronRightIcon />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}

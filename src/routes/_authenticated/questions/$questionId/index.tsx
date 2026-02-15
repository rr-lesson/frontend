import { getQuestionOptions } from "@/api/@tanstack/react-query.gen";
import { jotaiStore, navbarTitleAtom } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Mathematics from "@tiptap/extension-mathematics";
import { generateHTML } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import katex from "katex";
import "katex/dist/katex.min.css";
import { UserIcon } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

export const Route = createFileRoute("/_authenticated/questions/$questionId/")({
  component: RouteComponent,
  onEnter: () => {
    jotaiStore.set(navbarTitleAtom, "Detail Pertanyaan");
  },
});

function RouteComponent() {
  const { questionId } = Route.useParams();
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: dataQuestion } = useQuery({
    ...getQuestionOptions({
      path: {
        questionId: Number(questionId),
      },
      query: {
        includes: ["user", "subject", "class"],
      },
    }),
    enabled: !!questionId,
  });

  const content = useMemo(() => {
    if (dataQuestion) {
      return generateHTML(JSON.parse(dataQuestion.question.data.question), [
        StarterKit,
        Mathematics,
      ]);
    }
  }, [dataQuestion]);

  useEffect(() => {
    if (!contentRef.current) return;

    const mathNodes = contentRef.current.querySelectorAll(
      "[data-type='inline-math'], [data-type='block-math']",
    );

    mathNodes.forEach((node) => {
      const latex = node.getAttribute("data-latex");
      if (!latex) return;

      katex.render(latex, node as HTMLElement, {
        displayMode: node.getAttribute("data-type") === "block-math",
        throwOnError: false,
      });
    });
  }, [content]);

  return (
    <div className="space-y-4 py-4">
      {/* profile */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center size-10 bg-primary/10 rounded-full">
          <UserIcon className="size-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium">
            {dataQuestion?.question.user.name ?? "-"}
          </p>
          <p className="text-xs text-muted-foreground">
            {dataQuestion?.question.subject.name ?? "-"} •{" "}
            {dataQuestion?.question.class.name ?? "-"}
          </p>
        </div>
      </div>

      <div
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: content ?? "" }}
      />
    </div>
  );
}

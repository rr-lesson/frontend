import { getAllQuestionsOptions } from "@/api/@tanstack/react-query.gen";
import { ListItemQuestion } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

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
              <ListItemQuestion
                key={"list-item-question-" + index}
                data={item}
              />
            ))}
        </div>
      </div>
    </>
  );
}

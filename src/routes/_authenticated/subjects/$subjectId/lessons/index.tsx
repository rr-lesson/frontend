import { getAllLessonsOptions } from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import { jotaiStore, navbarTitleAtom } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/subjects/$subjectId/lessons/",
)({
  component: RouteComponent,
  onEnter: () => {
    jotaiStore.set(navbarTitleAtom, "Daftar Materi");
  },
});

function RouteComponent() {
  const { subjectId } = Route.useParams();

  const { data: dataLessons } = useQuery({
    ...getAllLessonsOptions({
      query: { subjectId: Number(subjectId) },
    }),
    enabled: subjectId !== undefined,
  });

  return (
    <div className="py-6">
      <p className="text-xl font-semibold">Daftar Materi</p>

      <div className="flex flex-wrap gap-2 mt-4">
        {dataLessons &&
          dataLessons.lessons.map((item, index) => (
            <Button key={"lesson-item-" + index} variant={"outline"} asChild>
              <Link
                to="/subjects/$subjectId/lessons/$lessonId/videos"
                params={{
                  subjectId,
                  lessonId: String(item.id),
                }}
              >
                {item.title}
              </Link>
            </Button>
          ))}
      </div>
    </div>
  );
}

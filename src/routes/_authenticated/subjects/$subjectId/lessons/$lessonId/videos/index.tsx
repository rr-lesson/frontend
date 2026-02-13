import { getAllVideosOptions } from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { jotaiStore, navbarTitleAtom } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PlayIcon, VideoIcon } from "lucide-react";

export const Route = createFileRoute(
  "/_authenticated/subjects/$subjectId/lessons/$lessonId/videos/",
)({
  component: RouteComponent,
  onEnter: () => {
    jotaiStore.set(navbarTitleAtom, "Daftar Video");
  },
});

function RouteComponent() {
  const { subjectId, lessonId } = Route.useParams();

  const { data: dataVideos } = useQuery({
    ...getAllVideosOptions({
      query: { lessonId: Number(lessonId) },
    }),
    enabled: lessonId !== undefined,
  });

  return (
    <div className="py-6">
      <p className="text-xl font-semibold">Daftar Video</p>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {dataVideos &&
          dataVideos.videos.map((item, index) => (
            <Card key={"video-item-" + index} className="pt-0 overflow-hidden">
              <div className="w-full aspect-video bg-muted flex items-center justify-center">
                <VideoIcon className="size-[30%] text-muted-foreground" />
              </div>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button variant={"outline"} className="w-full" asChild>
                  <Link
                    to="/subjects/$subjectId/lessons/$lessonId/videos/$videoId"
                    params={{
                      subjectId,
                      lessonId,
                      videoId: String(item.id),
                    }}
                  >
                    <PlayIcon />
                    Tonton
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}

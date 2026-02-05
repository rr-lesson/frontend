import { getAllVideosWithDetailOptions } from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { jotaiStore, navbarTitleAtom } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Edit2Icon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
  VideoIcon,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/video/")({
  component: RouteComponent,
  onEnter: () => {
    jotaiStore.set(navbarTitleAtom, "Video Management");
  },
});

function RouteComponent() {
  const { data: dataVideos, isSuccess: isSuccessVideos } = useQuery({
    ...getAllVideosWithDetailOptions(),
  });

  return (
    <>
      <div className="py-6">
        <div
          className="flex items-center
         justify-between"
        >
          <p className="text-lg font-semibold">Daftar Video Pembelajaran</p>
          <Button variant={"outline"} asChild>
            <Link to="/admin/video/create">
              <PlusIcon />
              Tambah video pembelajaran
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          {isSuccessVideos &&
            dataVideos &&
            dataVideos.videos.map((item, index) => (
              <Card
                key={"video-item-" + index}
                className="pt-0 overflow-hidden"
              >
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <VideoIcon className="text-muted-foreground size-[30%]" />
                </div>
                <CardHeader>
                  <CardTitle>{item.video.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {item.video.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    {[
                      item.class.name,
                      item.subject.name,
                      item.lesson.title,
                    ].join(", ")}
                  </p>
                </CardContent>
                <CardFooter className="gap-1">
                  <Button className="flex-1" variant={"outline"} asChild>
                    <Link
                      to="/admin/video/$videoId"
                      params={{ videoId: String(item.video.id) }}
                    >
                      <PlayIcon />
                      Lihat
                    </Link>
                  </Button>
                  <Button size={"icon"} variant={"outline"}>
                    <Edit2Icon />
                  </Button>
                  <Button size={"icon"} variant={"destructive"}>
                    <TrashIcon />
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </>
  );
}

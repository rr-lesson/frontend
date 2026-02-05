import { getVideoWithDetailOptions } from "@/api/@tanstack/react-query.gen";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import ReactPlayer from "react-player";

export const Route = createFileRoute(
  "/_authenticated/subjects/$subjectId/lessons/$lessonId/videos/$videoId/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { videoId } = Route.useParams();

  const [resolution, setResolution] = useState(0);

  const { data: dataVideo } = useQuery({
    ...getVideoWithDetailOptions({
      path: { videoId: Number(videoId) },
    }),
    enabled: videoId !== undefined,
  });

  const videoSrc = useMemo(() => {
    if (dataVideo) {
      return [
        import.meta.env.VITE_API_BASE_URL,
        "api/v1/hls/videos",
        dataVideo.video.video.file_path,
        "master.m3u8",
      ].join("/");
    }
  }, [dataVideo]);

  return (
    <div className="py-6">
      <p>video src: {videoSrc}</p>
      <div className="aspect-video w-full">
        <ReactPlayer
          src={videoSrc}
          style={{ height: "100%", width: "100%" }}
          controls
          config={{
            hls: {
              startLevel: resolution,
            },
          }}
        />
      </div>

      <Select
        value={String(resolution)}
        onValueChange={(value) => setResolution(Number(value))}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Resolusi" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="0">480p</SelectItem>
            <SelectItem value="1">720p</SelectItem>
            <SelectItem value="2">1080p</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className="mt-4">
        <p className="text-lg font-medium">
          {dataVideo && dataVideo.video.video.title}
        </p>
        <p className="text-muted-foreground">
          {dataVideo && dataVideo.video.video.description}
        </p>
      </div>
    </div>
  );
}

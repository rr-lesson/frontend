import { getVideoWithDetailOptions } from "@/api/@tanstack/react-query.gen";
import { jotaiStore, navbarTitleAtom } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import ReactPlayer from "react-player";

export const Route = createFileRoute("/_authenticated/admin/video/$videoId/")({
  component: RouteComponent,
  onEnter: () => {
    jotaiStore.set(navbarTitleAtom, "Detail Video Pembelajaran");
  },
});

function RouteComponent() {
  const { videoId } = Route.useParams();

  const { data: dataVideo } = useQuery({
    ...getVideoWithDetailOptions({ path: { videoId: Number(videoId) } }),
    enabled: videoId !== undefined,
  });

  const videoPath = useMemo(() => {
    if (dataVideo) {
      return [
        import.meta.env.VITE_API_BASE_URL,
        "api/v1/hls2/videos",
        dataVideo.video.video.file_path,
        "master.m3u8",
      ].join("/");
    }
  }, [dataVideo]);

  return (
    <div>
      <p>Video id: {videoId}</p>
      <p>Video path: {videoPath}</p>

      <div className="aspect-video w-full">
        <ReactPlayer
          src={videoPath}
          style={{
            width: "100%",
            height: "100%",
          }}
          controls
          config={{
            hls: {
              startLevel: 2,
            },
          }}
        />
      </div>
    </div>
  );
}

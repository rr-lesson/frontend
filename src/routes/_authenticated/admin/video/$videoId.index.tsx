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
  // const playerRef = useRef<HTMLVideoElement | null>(null);

  const { data: dataVideo } = useQuery({
    ...getVideoWithDetailOptions({ path: { videoId: Number(videoId) } }),
    enabled: videoId !== undefined,
  });

  // useEffect(() => {
  //   console.log({ player: playerRef.current });
  //   if (playerRef.current !== null) {
  //     console.log({ test: playerRef.current.value });
  //   }
  //   // if (playerRef.current !== null) {
  //   //   console.log(
  //   //     "player ready",
  //   //     (playerRef.current as any).getInternalPlayer("hls"),
  //   //   );
  //   // }
  // }, [playerRef]);

  // const changeQuality = (index: number) => {
  //   // Sekarang TypeScript tidak akan komplain
  //   if (playerRef.current !== null) {
  //     console.log("change quality to index:", index);
  //     const hlsInstance = (playerRef.current as any).getInternalPlayer("hls");
  //     if (hlsInstance) {
  //       hlsInstance.currentLevel = index;
  //     }
  //   }
  // };

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
          // ref={playerRef}
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
          onReady={() => console.log("on ready")}
          onLoad={() => console.log("on load")}
        />
      </div>

      {/* <div>
        <Button onClick={() => changeQuality(0)}>0</Button>
        <Button onClick={() => changeQuality(1)}>1</Button>
        <Button onClick={() => changeQuality(2)}>2</Button>
      </div> */}
    </div>
  );
}

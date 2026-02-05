import { createFileRoute } from "@tanstack/react-router";
import ReactPlayer from "react-player";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="max-w-5xl">
      <div className="w-full aspect-video">
        <ReactPlayer
          src="https://youtu.be/0uVpeDQx5cw"
          style={{ width: "100%", height: "100%" }}
          controls
          config={{ youtube: { widget_referrer: "" } }}
        />
      </div>
    </div>
  );
}

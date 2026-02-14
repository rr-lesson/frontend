import { type FileRouteTypes } from "@/routeTree.gen";
import {
  createFileRoute,
  Link,
  Outlet,
  useMatchRoute,
} from "@tanstack/react-router";
import clsx from "clsx";
import {
  LayoutDashboardIcon,
  MessageCircleQuestionIcon,
  SettingsIcon,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/_home")({
  component: RouteComponent,
});

const navItems: {
  icon: React.ReactNode;
  title: string;
  to: FileRouteTypes["to"];
}[] = [
  {
    icon: <LayoutDashboardIcon className="size-5" />,
    title: "Dashboard",
    to: "/",
  },
  {
    icon: <MessageCircleQuestionIcon className="size-5" />,
    title: "Ruang Tanya",
    to: "/questions",
  },
  {
    icon: <SettingsIcon className="size-5" />,
    title: "Pengaturan",
    to: "/settings",
  },
];

function RouteComponent() {
  const matchRoute = useMatchRoute();

  return (
    <div>
      <div>
        <Outlet />
      </div>

      {/* navbar */}
      <div className="fixed bottom-0 w-full right-0 left-0 mb-[env(safe-area-inset-bottom)] pointer-events-auto">
        <div className="rounded-full border backdrop-blur-md flex items-center bg-card/70 w-fit mx-auto h-[calc(var(--spacing) * 15)] overflow-hidden px-0.5 mb-4">
          {navItems.map((item, index) => {
            const isActive = matchRoute({ to: item.to });

            return (
              <Link
                to={item.to}
                key={"nav-item-" + index}
                className={clsx(
                  "flex flex-col items-center px-4 gap-0.5 h-14 justify-center rounded-full my-0.5 active:scale-95 transition-all",
                  isActive && "bg-primary/10",
                )}
                replace
              >
                <span
                  className={clsx(
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.icon}
                </span>
                <p
                  className={clsx(
                    "text-xs",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.title}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

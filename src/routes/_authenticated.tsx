import { refreshTokenMutation } from "@/api/@tanstack/react-query.gen";
import { AppSidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { navbarTitleAtom, userProfileAtom } from "@/stores";
import { useMutation } from "@tanstack/react-query";
import {
  createFileRoute,
  Outlet,
  redirect,
  useCanGoBack,
  useRouter,
} from "@tanstack/react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { ChevronLeftIcon } from "lucide-react";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
  loader: () => {
    if (!localStorage.getItem("userProfile"))
      throw redirect({ to: "/auth/login", replace: true });
  },
});

function RouteComponent() {
  const navbarTitle = useAtomValue(navbarTitleAtom);
  const setUserProfile = useSetAtom(userProfileAtom);
  const isMobile = useIsMobile();
  const canGoBack = useCanGoBack();
  const router = useRouter();

  const refreshTokenRunned = useRef(false);
  const { mutate: mutateRefreshToken } = useMutation({
    ...refreshTokenMutation(),
    onSuccess: (data) => setUserProfile(data.user),
    onError: (error) => {
      if (error.code === 401) {
        setUserProfile(null);
        localStorage.removeItem("userProfile");
        router.navigate({ to: "/auth/login", replace: true });
      }
    },
  });

  useEffect(() => {
    if (refreshTokenRunned.current) return;
    mutateRefreshToken({});
    refreshTokenRunned.current = true;
  }, []);

  return (
    <>
      <SidebarProvider>
        {/* sidebar */}
        {isMobile || <AppSidebar />}

        <SidebarInset>
          <main>
            {/* top app bar */}
            <header className="border-b h-16 w-full sticky top-[env(safe-area-inset-top)] z-10 backdrop-blur-md bg-background/70">
              <div className="flex items-center h-16 px-4 justify-between">
                <div className="flex items-center space-x-4">
                  {isMobile || <SidebarTrigger />}
                  {/* back button */}
                  {isMobile && canGoBack && (
                    <Button
                      onClick={() => {
                        if (canGoBack) router.history.back();
                      }}
                      variant={"secondary"}
                      className="text-primary rounded-full bg-card border"
                      size={"icon-lg"}
                    >
                      <ChevronLeftIcon className="size-5" />
                    </Button>
                  )}
                  <p className="text-lg font-medium">{navbarTitle}</p>
                </div>
              </div>
            </header>

            {/* content */}
            <div className="pt-[env(safe-area-inset-top)]">
              <div className="max-w-5xl mx-auto px-4 w-full">
                <Outlet />
              </div>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

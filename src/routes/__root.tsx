import { ThemeProvider } from "@/components/theme-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import { router } from "@/lib/router";
import { jotaiStore } from "@/stores";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import { Provider } from "jotai";
import { useLayoutEffect, useRef } from "react";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => {
    const {
      location: {
        state: { __TSR_index: index = 0 },
      },
    } = useRouterState();

    const prevIndexRef = useRef<number | null>(null);
    const hasMountedRef = useRef(false);
    const isMobile = useIsMobile();

    useLayoutEffect(() => {
      if (!hasMountedRef.current) {
        prevIndexRef.current = index;
        hasMountedRef.current = true;

        router.update({ defaultViewTransition: true });
        return;
      }

      if (!isMobile) {
        document.documentElement.removeAttribute("data-nav");
        prevIndexRef.current = index;
        return;
      }

      const direction =
        index > (prevIndexRef.current ?? 0) ? "forward" : "back";

      document.documentElement.dataset.nav = direction;
      prevIndexRef.current = index;
    }, [index, isMobile]);

    return (
      <>
        <QueryClientProvider client={queryClient}>
          <Provider store={jotaiStore}>
            <ThemeProvider defaultTheme="light">
              <Outlet />
            </ThemeProvider>
          </Provider>
        </QueryClientProvider>
      </>
    );
  },
});

import { ThemeProvider } from "@/components/theme-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import { jotaiStore } from "@/stores";
// import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
// import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Provider } from "jotai";
import { useEffect, useRef } from "react";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => {
    const {
      location: {
        state: { __TSR_index: index = 0 },
      },
    } = useRouterState();

    const prevIndexRef = useRef<number | null>(null);
    const isMobile = useIsMobile();

    useEffect(() => {
      if (!isMobile) {
        document.documentElement.removeAttribute("data-nav");
        prevIndexRef.current = index;
        return;
      }

      if (prevIndexRef.current === null) {
        prevIndexRef.current = index;
        return;
      }

      const direction = index > prevIndexRef.current ? "forward" : "back";

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
          {/* <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        /> */}
        </QueryClientProvider>
      </>
    );
  },
});

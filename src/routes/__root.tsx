import { ThemeProvider } from "@/components/theme-provider";
import { jotaiStore } from "@/stores";
// import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRoute } from "@tanstack/react-router";
// import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Provider } from "jotai";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: () => (
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
  ),
});

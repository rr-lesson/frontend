import { AppSidebar } from "@/components/sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { navbarTitleAtom } from "@/stores";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAtomValue } from "jotai";

export const Route = createFileRoute("/_authenticated")({
  component: RouteComponent,
});

function RouteComponent() {
  const navbarTitle = useAtomValue(navbarTitleAtom);

  return (
    <>
      <SidebarProvider>
        {/* sidebar */}
        <AppSidebar />

        <SidebarInset>
          <main className="flex-1">
            {/* navbar */}
            <header className="border-b h-16 w-full fixed top-0 z-10 backdrop-blur-md">
              <div className="flex items-center h-16 px-4 space-x-4">
                <SidebarTrigger />
                <p className="text-base font-medium">{navbarTitle}</p>
              </div>
            </header>

            {/* content */}
            <div className="max-w-5xl mx-auto px-4 pt-16 w-full">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

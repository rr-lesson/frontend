import { Command } from "lucide-react";
import { AdminSidebarGroup, UserSidebarGroup } from ".";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

export const AppSidebar = () => {
  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Bisa</span>
                  <span className="truncate text-xs">Bimbingan Belajar</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {/* admin */}
          <AdminSidebarGroup />

          {/* user */}
          <UserSidebarGroup />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
    </>
  );
};

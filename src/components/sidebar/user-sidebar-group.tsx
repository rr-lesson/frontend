import { Link } from "@tanstack/react-router";
import { HomeIcon, MessageCircleQuestionIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

export const UserSidebarGroup = () => {
  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Pengguna</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {/* home */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/">
                  <HomeIcon />
                  Halaman Utama
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* questions and answer */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/questions">
                  <MessageCircleQuestionIcon />
                  Ruang Tanya
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

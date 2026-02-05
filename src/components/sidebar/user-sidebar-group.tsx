import {
  getAllLessonsOptions,
  getAllSubjectsOptions,
} from "@/api/@tanstack/react-query.gen";
import { currentClassAtom } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useAtomValue } from "jotai";
import { GraduationCapIcon, HomeIcon, LibraryBigIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import { Spinner } from "../ui/spinner";

export const UserSidebarGroup = () => {
  const currentClass = useAtomValue(currentClassAtom);

  const { isLoading: isLoadingSubjects, data: dataSubjects } = useQuery({
    ...getAllSubjectsOptions({
      query: { classId: (currentClass && currentClass) || undefined },
    }),
  });

  const { isLoading: isLoadingLessons, data: dataLessons } = useQuery({
    ...getAllLessonsOptions({
      query: { classId: (currentClass && currentClass) || undefined },
    }),
  });

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

            {/* subject */}
            <SidebarMenuItem>
              <SidebarMenuButton>
                <GraduationCapIcon />
                Mata Pelajaran
              </SidebarMenuButton>
              {isLoadingSubjects && (
                <SidebarMenuAction>
                  <Spinner />
                </SidebarMenuAction>
              )}

              {/* items */}
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  {dataSubjects &&
                    dataSubjects.subjects.map((item, index) => (
                      <SidebarMenuSubButton
                        key={"subject-item-" + index}
                        asChild
                      >
                        <Link
                          to="/subjects/$subjectId/lessons"
                          params={{ subjectId: String(item.id) }}
                        >
                          {item.name}
                        </Link>
                      </SidebarMenuSubButton>
                    ))}
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>

            {/* lesson */}
            <SidebarMenuItem>
              <SidebarMenuButton>
                <LibraryBigIcon />
                Materi Pembelajaran
              </SidebarMenuButton>
              {isLoadingLessons && (
                <SidebarMenuAction>
                  <Spinner />
                </SidebarMenuAction>
              )}

              {/* items */}
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  {dataLessons &&
                    dataLessons.lessons.map((item, index) => (
                      <SidebarMenuSubButton
                        key={"lesson-item-" + index}
                        asChild
                      >
                        <Link
                          to="/subjects/$subjectId/lessons/$lessonId/videos"
                          params={{
                            subjectId: String(item.subject_id),
                            lessonId: String(item.id),
                          }}
                        >
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    ))}
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

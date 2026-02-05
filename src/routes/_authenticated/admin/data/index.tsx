import {
  getAllClassesOptions,
  getAllLessonWithClassSubjectOptions,
  getAllSubjectDetailsOptions,
} from "@/api/@tanstack/react-query.gen";
import { CreateClassDialog } from "@/components/class";
import { CreateLessonDialog } from "@/components/lesson";
import { CreateSubjectDialog } from "@/components/subject";
import { Button } from "@/components/ui/button";
import {} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { jotaiStore, navbarTitleAtom } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MoreVerticalIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/admin/data/")({
  component: RouteComponent,
  onEnter: () => {
    jotaiStore.set(navbarTitleAtom, "Data Management");
  },
});

function RouteComponent() {
  const [createClassDialog, setCreateClassDialog] = useState({
    open: false,
  });
  const [createSubjectDialog, setCreateSubjectDialog] = useState({
    open: false,
  });
  const [createLessonDialog, setCreateLessonDialog] = useState({
    open: false,
  });

  const {
    data: dataClasses,
    isSuccess: isSuccessClasses,
    refetch: refetchClasses,
  } = useQuery({
    ...getAllClassesOptions(),
  });
  const {
    data: dataSubjectDetails,
    isSuccess: isSuccessSubjectDetails,
    refetch: refetchSubjectDetails,
  } = useQuery({
    ...getAllSubjectDetailsOptions(),
  });
  const {
    data: dataLessonWithClassSubject,
    isSuccess: isSuccessLessonWithClassSubject,
    refetch: refetchLessonWithClassSubject,
  } = useQuery({
    ...getAllLessonWithClassSubjectOptions(),
  });

  return (
    <>
      <div className="space-y-6 py-6">
        {/* classes */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Daftar Kelas</p>
            <Button
              onClick={() => setCreateClassDialog({ open: true })}
              variant={"outline"}
            >
              <PlusIcon />
              Tambah kelas
            </Button>
          </div>

          <div className="border rounded-md overflow-hidden w-full max-w-full">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-4">Kelas</TableHead>
                  <TableHead className="w-16 px-4">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isSuccessClasses &&
                  dataClasses &&
                  dataClasses.classes.map((item, index) => (
                    <TableRow key={"class-item-" + index}>
                      <TableCell className="px-4">{item.name}</TableCell>
                      <TableCell className="px-4">
                        <Button variant={"outline"} size={"icon"}>
                          <MoreVerticalIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* subjects */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Daftar Mata Pelajaran</p>
            <Button
              variant={"outline"}
              onClick={() => setCreateSubjectDialog({ open: true })}
            >
              <PlusIcon />
              Tambah mata pelajaran
            </Button>
          </div>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-4">Mata pelajaran</TableHead>
                  <TableHead className="px-4">Kelas</TableHead>
                  <TableHead className="w-16 px-4">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isSuccessSubjectDetails &&
                  dataSubjectDetails &&
                  dataSubjectDetails.subjects.map((item, index) => (
                    <TableRow key={"subject-class-item-" + index}>
                      <TableCell className="px-4">
                        {item.subject.name}
                      </TableCell>
                      <TableCell className="px-4">{item.class.name}</TableCell>
                      <TableCell className="px-4">
                        <Button variant={"outline"} size={"icon"}>
                          <MoreVerticalIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* lessons */}
        <div className="space-y-2 w-full">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Daftar Materi</p>
            <Button
              variant={"outline"}
              onClick={() => setCreateLessonDialog({ open: true })}
            >
              <PlusIcon />
              Tambah materi
            </Button>
          </div>

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead className="px-4">Materi</TableHead>
                  <TableHead className="px-4">Mata pelajaran</TableHead>
                  <TableHead className="px-4">Kelas</TableHead>
                  <TableHead className="w-16 px-4">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isSuccessLessonWithClassSubject &&
                  dataLessonWithClassSubject &&
                  dataLessonWithClassSubject.lessons.map((item, index) => (
                    <TableRow key={"lesson-with-class-subject-item-" + index}>
                      <TableCell className="px-4">
                        {item.lesson.title} test panjang
                      </TableCell>
                      <TableCell className="px-4">
                        {item.subject.name}
                      </TableCell>
                      <TableCell className="px-4">{item.class.name}</TableCell>
                      <TableCell className="px-4">
                        <Button variant={"outline"} size={"icon"}>
                          <MoreVerticalIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* dialogs */}
      <CreateClassDialog
        open={createClassDialog.open}
        onOpenChange={(open, status) => {
          setCreateClassDialog({ open });
          if (status) refetchClasses();
        }}
      />
      <CreateSubjectDialog
        open={createSubjectDialog.open}
        onOpenChange={(open, status) => {
          setCreateSubjectDialog({ open });
          if (status) refetchSubjectDetails();
        }}
      />
      <CreateLessonDialog
        open={createLessonDialog.open}
        onOpenChange={(open, status) => {
          setCreateLessonDialog({ open });
          if (status) refetchLessonWithClassSubject();
        }}
      />
    </>
  );
}

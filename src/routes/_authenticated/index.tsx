import type { Class } from "@/api";
import {
  getAllClassesOptions,
  getAllSubjectsOptions,
} from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { currentClassAtom, jotaiStore, navbarTitleAtom } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useAtom } from "jotai";

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,
  onEnter: () => {
    jotaiStore.set(navbarTitleAtom, "Halaman Utama");
  },
});

function RouteComponent() {
  const [currentClass, setCurrentClass] = useAtom(currentClassAtom);

  const { data: dataClasses, isLoading: isLoadingClasses } = useQuery({
    ...getAllClassesOptions(),
  });
  const { data: dataSubjects, isLoading: isLoadingSubjects } = useQuery({
    ...getAllSubjectsOptions({
      query: { classId: currentClass || undefined },
    }),
  });

  return (
    <div className="py-6 space-y-6">
      <div>
        <p className="text-xl font-semibold">Halaman Utama</p>
      </div>

      <Combobox
        items={(dataClasses && dataClasses.classes) || []}
        itemToStringLabel={(item: Class) => item.name}
        value={
          (currentClass &&
            dataClasses &&
            dataClasses.classes.find((it) => it.id === currentClass)) ||
          null
        }
        onValueChange={(e) => setCurrentClass(e?.id || null)}
      >
        <ComboboxInput placeholder="Pilih kelas" />
        <ComboboxContent>
          <ComboboxEmpty>Kelas tidak ditemukan.</ComboboxEmpty>
          <ComboboxList>
            {(item: Class) => (
              <ComboboxItem key={"class-item-" + item.id} value={item}>
                {item.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <div>
        <p className="text-lg font-medium">Daftar Mata Pelajaran</p>
        <div className="grid grid-cols-3 mt-2">
          {dataSubjects &&
            dataSubjects.subjects.map((item, index) => (
              <Button key={"subject-item-" + index} variant={"outline"} asChild>
                <Link
                  to="/subjects/$subjectId/lessons"
                  params={{ subjectId: String(item.id) }}
                >
                  {item.name}
                </Link>
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
}

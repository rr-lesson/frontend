import type { Class } from "@/api";
import {
  getAllClassesOptions,
  getAllSubjectsOptions,
} from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { PlayIcon, PlusIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/")({
  component: RouteComponent,
  onEnter: () => {
    jotaiStore.set(navbarTitleAtom, "Ringkasan");
  },
});

function RouteComponent() {
  const [currentClass, setCurrentClass] = useAtom(currentClassAtom);

  const { data: dataClasses } = useQuery({
    ...getAllClassesOptions(),
  });
  const { data: dataSubjects } = useQuery({
    ...getAllSubjectsOptions({
      query: { classId: currentClass || undefined },
    }),
  });

  return (
    <div className="py-6 space-y-6">
      <div>
        <p className="text-xl font-semibold">Halo, Rizal Dwi Anggoro!</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Siap jadi lebih pintar?</CardTitle>
          <CardDescription>
            Tentukan mata pelajaran dan mulai perjalanan belajarmu.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1">
            {dataSubjects &&
              dataSubjects.subjects.map((item, index) => (
                <Link
                  key={"subject-item-" + index}
                  to="/subjects/$subjectId/lessons"
                  params={{ subjectId: String(item.id) }}
                  className="flex items-center gap-3"
                >
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <PlayIcon className="text-primary size-5" />
                  </div>
                  <p className="text-sm">{item.name}</p>
                </Link>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <p className="text-lg font-medium">
            Punya soal yang masih membingungkan?
          </p>
          <p className="text-sm text-muted-foreground">
            Tanyakan melalui RuangTanya dan dapatkan penjelasan lengkap dari
            guru, disertai langkah-langkah penyelesaian yang mudah dipahami.
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button className="flex-1" variant={"outline"} asChild>
            <Link to="/questions">Lihat daftar pertanyaan</Link>
          </Button>
          <Button variant={"default"} asChild size={"icon"}>
            <Link to="/questions/create">
              <PlusIcon />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

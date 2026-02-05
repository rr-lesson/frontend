import type { Class, Lesson, Subject } from "@/api";
import {
  createVideoMutation,
  getAllClassesOptions,
  getAllLessonsBySubjectIdOptions,
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroupAddon } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export const Route = createFileRoute("/_authenticated/admin/video/create")({
  component: RouteComponent,
});

const formSchema = z.object({
  classId: z
    .number("Kelas tidak boleh kosong!")
    .min(1, "Kelas tidak boleh kosong!"),
  subjectId: z
    .number("Mata pelajaran tidak boleh kosong!")
    .min(1, "Mata pelajaran tidak boleh kosong!"),
  lessonId: z
    .number("Materi tidak boleh kosong!")
    .min(1, "Materi tidak boleh kosong!"),
  path: z
    .string("Path video tidak boleh kosong!")
    .min(1, "Path video tidak boleh kosong!"),
  title: z
    .string("Judul video tidak boleh kosong!")
    .min(1, "Judul video tidak boleh kosong!"),
  description: z.string().optional(),
});

function RouteComponent() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { data: dataClassess, isLoading: isLoadingClasses } = useQuery({
    ...getAllClassesOptions(),
  });
  const { data: dataSubjects, isLoading: isLoadingSubjects } = useQuery({
    ...getAllSubjectsOptions({
      query: { classId: form.watch("classId") || 0 },
    }),
    enabled: !!form.watch("classId"),
  });
  const { data: dataLessons, isLoading: isLoadingLessons } = useQuery({
    ...getAllLessonsBySubjectIdOptions({
      path: {
        classId: form.watch("classId") || 0,
        subjectId: form.watch("subjectId") || 0,
      },
    }),
    enabled: !!form.watch("classId") && !!form.watch("subjectId"),
  });

  const { mutate: mutateCreate, isPending: isPendingCreate } = useMutation({
    ...createVideoMutation(),
    onSuccess: () => {
      navigate({ to: "/admin/video", replace: true });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) =>
    mutateCreate({
      path: {
        classId: data.classId,
        subjectId: data.subjectId,
        lessonId: data.lessonId,
      },
      body: {
        file_path: data.path,
        title: data.title,
        description: data.description || "",
      },
    });

  return (
    <>
      <form className="py-6 max-w-lg">
        <FieldGroup>
          <Controller
            name="classId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Kelas</FieldLabel>
                <Combobox
                  items={(dataClassess && dataClassess.classes) || []}
                  itemToStringLabel={(item: Class) => item.name}
                  value={
                    (dataClassess &&
                      dataClassess.classes.find(
                        (it) => it.id === field.value,
                      )) ||
                    null
                  }
                  onValueChange={(e) => {
                    if (e != null) field.onChange(e.id);
                  }}
                >
                  <ComboboxInput
                    placeholder="Pilih kelas"
                    aria-invalid={fieldState.invalid}
                    id={field.name}
                  >
                    {isLoadingClasses && (
                      <InputGroupAddon>
                        <Spinner />
                      </InputGroupAddon>
                    )}
                  </ComboboxInput>
                  <ComboboxContent>
                    <ComboboxEmpty>Kelas tidak ditemukan.</ComboboxEmpty>
                    <ComboboxList>
                      {(item: Class) => (
                        <ComboboxItem
                          className="pointer-events-auto"
                          key={"class-item-" + item.id}
                          value={item}
                        >
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* subject */}
          <Controller
            name="subjectId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Mata pelajaran</FieldLabel>
                <Combobox
                  items={(dataSubjects && dataSubjects.subjects) || []}
                  itemToStringLabel={(item: Subject) => item.name}
                  value={
                    (dataSubjects &&
                      dataSubjects.subjects.find(
                        (it) => it.id === field.value,
                      )) ||
                    null
                  }
                  onValueChange={(e) => {
                    if (e != null) field.onChange(e.id);
                  }}
                >
                  <ComboboxInput
                    placeholder="Pilih mata pelajaran"
                    aria-invalid={fieldState.invalid}
                    id={field.name}
                  >
                    {isLoadingSubjects && (
                      <InputGroupAddon>
                        <Spinner />
                      </InputGroupAddon>
                    )}
                  </ComboboxInput>
                  <ComboboxContent>
                    <ComboboxEmpty>
                      Mata pelajaran tidak ditemukan.
                    </ComboboxEmpty>
                    <ComboboxList>
                      {(item: Subject) => (
                        <ComboboxItem
                          className="pointer-events-auto"
                          key={"subject-item-" + item.id}
                          value={item}
                        >
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* lesson */}
          <Controller
            name="lessonId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Materi pembelajaran
                </FieldLabel>
                <Combobox
                  items={(dataLessons && dataLessons.lessons) || []}
                  itemToStringLabel={(item: Lesson) => item.title}
                  value={
                    (dataLessons &&
                      dataLessons.lessons.find(
                        (it) => it.id === field.value,
                      )) ||
                    null
                  }
                  onValueChange={(e) => {
                    if (e != null) field.onChange(e.id);
                  }}
                >
                  <ComboboxInput
                    placeholder="Pilih materi pembelajaran"
                    aria-invalid={fieldState.invalid}
                    id={field.name}
                  >
                    {isLoadingLessons && (
                      <InputGroupAddon>
                        <Spinner />
                      </InputGroupAddon>
                    )}
                  </ComboboxInput>
                  <ComboboxContent>
                    <ComboboxEmpty>
                      Materi pembelajaran tidak ditemukan.
                    </ComboboxEmpty>
                    <ComboboxList>
                      {(item: Lesson) => (
                        <ComboboxItem
                          className="pointer-events-auto"
                          key={"lesson-item-" + item.id}
                          value={item}
                        >
                          {item.title}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="path"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Video path</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="nama-folder"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Judul video</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Video peer to peer messaging"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Deskripsi video (opsional)
                </FieldLabel>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Deskripsi video..."
                  className="min-h-32"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex items-center justify-end gap-2">
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isPendingCreate}
            >
              {isPendingCreate && <Spinner />}
              Simpan
            </Button>
          </div>
        </FieldGroup>
      </form>
    </>
  );
}

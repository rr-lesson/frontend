import { type Class, type Subject } from "@/api";
import {
  createLessonMutation,
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { InputGroupAddon } from "../ui/input-group";
import { Spinner } from "../ui/spinner";

const formSchema = z.object({
  classId: z
    .number("Kelas tidak boleh kosong!")
    .min(1, "Kelas tidak boleh kosong!"),
  subjectId: z
    .number("Mata pelajaran tidak boleh kosong!")
    .min(1, "Mata pelajaran tidak boleh kosong!"),
  title: z
    .string("Judul materi tidak boleh kosong!")
    .min(1, "Judul materi tidak boleh kosong!"),
});

interface CreateLessonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
}
export const CreateLessonDialog = ({
  open,
  onOpenChange,
}: CreateLessonDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      classId: 0,
      subjectId: 0,
      title: "",
    },
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

  const { mutate, isPending } = useMutation({
    ...createLessonMutation(),
    onSuccess: () => {
      onOpenChange(false, true);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) =>
    mutate({
      body: { subject_id: data.subjectId, title: data.title },
    });

  return (
    <Dialog open={open} onOpenChange={(e) => onOpenChange(e)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Materi Baru</DialogTitle>
          <DialogDescription>
            Masukkan detail informasi berikut untuk membuat materi baru.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* class */}
            <Controller
              name="classId"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Kelas</FieldLabel>
                  <Combobox
                    items={(dataClassess && dataClassess.classes) || []}
                    itemToStringValue={(item: Class) => String(item.id)}
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
                    itemToStringValue={(item: Subject) => String(item.id)}
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

            {/* title */}
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Judul materi</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="Matematika"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Batal</Button>
          </DialogClose>
          <Button disabled={isPending} onClick={form.handleSubmit(onSubmit)}>
            {isPending && <Spinner />}
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

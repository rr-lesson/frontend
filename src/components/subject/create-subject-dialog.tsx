import type { Class } from "@/api";
import {
  createSubjectMutation,
  getAllClassesOptions,
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
  name: z
    .string("Nama mata pelajaran tidak boleh kosong!")
    .min(1, "Nama mata pelajaran tidak boleh kosong!"),
});

interface CreateSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
}
export const CreateSubjectDialog = ({
  open,
  onOpenChange,
}: CreateSubjectDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { data: dataClassess, isLoading: isLoadingClasses } = useQuery({
    ...getAllClassesOptions(),
  });

  const { mutate, isPending } = useMutation({
    ...createSubjectMutation(),
    onSuccess: () => {
      onOpenChange(false, true);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) =>
    mutate({ body: { class_id: data.classId, name: data.name } });

  return (
    <Dialog open={open} onOpenChange={(e) => onOpenChange(e)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mata Pelajaran Baru</DialogTitle>
          <DialogDescription>
            Masukkan detail informasi berikut untuk membuat mata pelajaran baru.
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
                      dataClassess &&
                      dataClassess.classes.find((it) => it.id === field.value)
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

            {/* name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    Nama mata pelajaran
                  </FieldLabel>
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

import { createClassMutation } from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
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
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  name: z
    .string("Nama mata pelajaran tidak boleh kosong!")
    .min(1, "Nama mata pelajaran tidak boleh kosong!"),
});

interface CreateClassDialogProps {
  open: boolean;
  onOpenChange: (open: boolean, status?: boolean) => void;
}
export const CreateClassDialog = ({
  open,
  onOpenChange,
}: CreateClassDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate, isPending } = useMutation({
    ...createClassMutation(),
    onSuccess: () => {
      onOpenChange(false, true);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) =>
    mutate({ body: { name: data.name } });

  return (
    <Dialog open={open} onOpenChange={(e) => onOpenChange(e)}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kelas Baru</DialogTitle>
            <DialogDescription>
              Masukkan informasi detail kelas pada form di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Nama kelas</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="10 MIPA"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Batal</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              onClick={form.handleSubmit(onSubmit)}
            >
              {isPending && <Loader2Icon className="animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

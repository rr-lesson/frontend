import {
  getCurrentUserOptions,
  updateCurrentUserMutation,
} from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { jotaiStore, userProfileAtom } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export const Route = createFileRoute("/_authenticated/me/profile")({
  component: RouteComponent,
});

const formScheme = z.object({
  name: z.string("Nama tidak boleh kosong!").min(1, "Nama tidak boleh kosong!"),
});

function RouteComponent() {
  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      name: "",
    },
  });

  const { data: dataUser } = useQuery({
    ...getCurrentUserOptions(),
  });
  const { mutate, isPending } = useMutation({
    ...updateCurrentUserMutation(),
    onSuccess: (data) => {
      jotaiStore.set(userProfileAtom, data.user.data);
    },
  });

  useEffect(() => {
    if (dataUser) {
      form.reset({
        name: dataUser.user.data.name,
      });
    }
  }, [dataUser]);

  const onSubmit = (data: z.infer<typeof formScheme>) =>
    mutate({
      body: {
        name: data.name,
      },
    });

  return (
    <>
      <div className="py-4 space-y-4 max-w-lg">
        <form>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <div className="flex justify-end">
          <Button disabled={isPending} onClick={form.handleSubmit(onSubmit)}>
            {isPending && <Spinner />}
            Simpan
          </Button>
        </div>
      </div>
    </>
  );
}

import { registerMutation } from "@/api/@tanstack/react-query.gen";
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
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export const Route = createFileRoute("/_unauthenticated/auth/register")({
  component: RouteComponent,
});

const formSchema = z
  .object({
    name: z
      .string("Nama tidak boleh kosong!")
      .min(1, "Nama tidak boleh kosong!"),
    email: z
      .email("Alamat email tidak valid!")
      .min(1, "Alamat email tidak boleh kosong!"),
    password: z
      .string("Kata sandi tidak boleh kosong!")
      .min(1, "Kata sandi tidak boleh kosong!"),
    confirmPassword: z
      .string("Konfirmasi kata sandi tidak boleh kosong!")
      .min(1, "Konfirmasi kata sandi tidak boleh kosong!"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok!",
    path: ["confirmPassword"],
  });

function RouteComponent() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    ...registerMutation(),
    onSuccess: (data) => {
      jotaiStore.set(userProfileAtom, data.user);
      navigate({ to: "/", replace: true });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) =>
    mutate({
      body: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

  return (
    <div className="py-4 space-y-4 px-4 max-w-lg mx-auto">
      <img
        src="/android/android-launchericon-96-96.png"
        alt=""
        className="size-8"
      />
      <div>
        <p className="text-lg font-medium">
          Mari bergabung bersama BisaBimbel!
        </p>
        <p className="text-muted-foreground">
          Masukkan beberapa informasi berikut untuk membuat akun baru Anda dan
          mulai belajar bersama kami.
        </p>
      </div>
      <form>
        <FieldGroup className="gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Nama lengkap</FieldLabel>
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

          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Alamat email</FieldLabel>
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

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Kata sandi</FieldLabel>
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

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Konfirmasi kata sandi
                </FieldLabel>
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
      <div className="flex flex-col items-center gap-2">
        <Button
          className="w-full"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending && <Spinner />}
          Daftar
        </Button>
        <Button variant={"link"} asChild>
          <Link to="/auth/login" replace>
            Sudah punya akun? Masuk sekarang
          </Link>
        </Button>
      </div>
    </div>
  );
}

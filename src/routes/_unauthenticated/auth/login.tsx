import { loginMutation } from "@/api/@tanstack/react-query.gen";
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

export const Route = createFileRoute("/_unauthenticated/auth/login")({
  component: RouteComponent,
});

const formSchema = z.object({
  email: z
    .email("Alamat email tidak valid!")
    .min(1, "Alamat email tidak boleh kosong!"),
  password: z
    .string("Kata sandi tidak boleh kosong!")
    .min(1, "Kata sandi tidak boleh kosong!"),
});

function RouteComponent() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "gnoogler4@gmail.com",
      password: "password",
    },
  });

  const { mutate, isPending } = useMutation({
    ...loginMutation(),
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
          Selamat datang kembali di BisaBimbel!
        </p>
        <p className="text-muted-foreground">
          Silahkan masukkan beberapa informasi berikut untuk masuk ke akun Anda.
        </p>
      </div>
      <form>
        <FieldGroup className="gap-4">
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
        </FieldGroup>
      </form>
      <div className="flex flex-col items-center gap-2">
        <Button
          className="w-full"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isPending}
        >
          {isPending && <Spinner />}
          Masuk
        </Button>
        <Button variant={"link"} asChild>
          <Link to="/auth/register" replace>
            Belum punya akun? Daftar sekarang
          </Link>
        </Button>
      </div>
    </div>
  );
}

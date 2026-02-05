import type { Class } from "@/api";
import { getAllClassesOptions } from "@/api/@tanstack/react-query.gen";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

const formSchema = z.object({
  class: z
    .string("Kelas tidak boleh kosong!")
    .min(1, "Kelas tidak boleh kosong!"),
});

function RouteComponent() {
  const { data: dataClassess } = useQuery({
    ...getAllClassesOptions(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  return (
    <div className="max-w-lg mx-auto">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Controller
            name="class"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">Bug Title</FieldLabel>
                <Combobox
                  items={(dataClassess && dataClassess.classes) || []}
                  itemToStringLabel={(item: Class) => item.name}
                  value={
                    dataClassess &&
                    dataClassess.classes.find(
                      (item) => item.id === Number(field.value),
                    )
                  }
                  onValueChange={(e) => {
                    if (e != null) field.onChange(String(e.id));
                  }}
                >
                  <ComboboxInput
                    placeholder="Select a framework"
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>
                    <ComboboxList>
                      {(item: Class) => (
                        <ComboboxItem key={String(item.id)} value={item}>
                          {item.id} {item.name}
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
        </FieldGroup>

        <Button type="submit">Simpan</Button>
      </form>
    </div>
  );
}

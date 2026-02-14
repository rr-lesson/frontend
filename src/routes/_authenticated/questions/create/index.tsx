import {
  createQuestionMutation,
  getAllClassesOptions,
  getAllSubjectsOptions,
} from "@/api/@tanstack/react-query.gen";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { jotaiStore, navbarTitleAtom } from "@/stores";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useCanGoBack,
  useRouter,
} from "@tanstack/react-router";
import { Mathematics } from "@tiptap/extension-mathematics";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "katex/dist/katex.min.css";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

export const Route = createFileRoute("/_authenticated/questions/create/")({
  component: RouteComponent,
  onEnter: () => {
    jotaiStore.set(navbarTitleAtom, "Pertanyaan Baru");
  },
});

const formSchema = z.object({
  classId: z
    .number("Kelas tidak boleh kosong!")
    .min(1, "Kelas tidak boleh kosong!"),
  subjectId: z
    .number("Mata pelajaran tidak boleh kosong!")
    .min(1, "Mata pelajaran tidak boleh kosong!"),
  isQuestionEmpty: z
    .boolean("Pertanyaan tidak boleh kosong!")
    .refine((val) => val === false, {
      message: "Pertanyaan tidak boleh kosong!",
    }),
  question: z
    .string("Pertanyaan tidak boleh kosong!")
    .min(1, "Pertanyaan tidak boleh kosong!"),
});

function RouteComponent() {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  const editor = useEditor({
    extensions: [
      Placeholder.configure({ placeholder: "Tulis pertanyaanmu di sini..." }),
      StarterKit,
      Mathematics,
    ],
    onUpdate: ({ editor }) => {
      form.setValue("isQuestionEmpty", editor.isEmpty);
      form.setValue("question", JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class:
          "focus:outline-none px-3 border-input border rounded-md shadow-xs",
      },
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isQuestionEmpty: true,
      // question: `{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"test"}]}]}`,
    },
  });

  // useEffect(() => {
  //   form.reset({
  //     isQuestionEmpty: false,
  //     question: `{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"test"}]}]}`,
  //   });
  //   editor.commands.setContent(
  //     JSON.parse(
  //       `{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"test"}]}]}`,
  //     ),
  //   );
  // }, []);

  const { data: dataClasses, isLoading: isLoadingClasses } = useQuery({
    ...getAllClassesOptions(),
  });
  const { data: dataSubjects, isLoading: isLoadingSubjects } = useQuery({
    ...getAllSubjectsOptions({
      query: { classId: form.watch("classId") },
    }),
    enabled: !!form.watch("classId"),
  });
  const { mutate: mutateCreate, isPending: isPendingCreate } = useMutation({
    ...createQuestionMutation(),
    onSuccess: () => {
      if (canGoBack) router.history.back();
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) =>
    mutateCreate({
      body: {
        subject_id: data.subjectId,
        question: data.question,
      },
    });

  return (
    <div className="py-4">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-4">
          <Controller
            name="classId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Kelas</FieldLabel>
                <Select
                  disabled={isLoadingClasses}
                  aria-invalid={fieldState.invalid}
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(e) => field.onChange(Number(e))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {dataClasses &&
                        dataClasses.classes.map((item, index) => (
                          <SelectItem
                            key={"class-item-" + index}
                            value={String(item.id)}
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="subjectId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Mata Pelajaran</FieldLabel>
                <Select
                  disabled={isLoadingSubjects}
                  aria-invalid={fieldState.invalid}
                  value={field.value ? String(field.value) : undefined}
                  onValueChange={(e) => field.onChange(Number(e))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mata pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {dataSubjects &&
                        dataSubjects.subjects.map((item, index) => (
                          <SelectItem
                            key={"subject-item-" + index}
                            value={String(item.id)}
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="isQuestionEmpty"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Pertanyaan</FieldLabel>
                <div className="prose dark:prose-invert">
                  <EditorContent
                    id={field.name}
                    editor={editor}
                    aria-invalid={fieldState.invalid}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>

      <Button
        onClick={form.handleSubmit(onSubmit)}
        className="fixed bottom-[env(safe-area-inset-bottom)] left-4 right-4 mb-4"
      >
        {isPendingCreate && <Spinner />}
        Ajukan
      </Button>
    </div>
  );
}

"use client";
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/src/components/ui/form";
import MultiSelectFormField from "@/src/components/ui/multi-select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface Edition {
  id: number;
  name: string;
  author: string;
  language: string;
  direction: string;
  source: string;
  type: string;
  enabled: number;
}

interface EditionMultiSelectFormProps {
  edition: Edition[];
  queryParam: string;
}
export const EditionMultiSelectForm = ({ edition, queryParam }: EditionMultiSelectFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<{ quran: string[] }>({
    defaultValues: {
      quran: [],
    },
  });

  const parsedEditions = edition.map((edition) => ({
    label: edition.author!,
    value: edition.id.toString(),
  }));

  const updateQueryParam = (selectedEditions: string[]) => {
    const enabledEditions = selectedEditions.join(",");
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set(queryParam, enabledEditions);
    const newQueryString = currentParams.toString().replace(/%2C/g, ","); // Replace encoded commas with actual commas
    router.push(`?${newQueryString}`);
  };

  useEffect(() => {
    const qParam = searchParams.get(queryParam);
    if (qParam) {
      const selectedEditions: string[] = qParam.split(","); // Specify the type as string[]
      form.setValue("quran", selectedEditions);
    }
  }, [searchParams, form, queryParam]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      updateQueryParam(value.quran as string[]);
    });
    return () => subscription.unsubscribe();
  }, [form, queryParam]);

  const onSubmit = (data: { quran: string[] }) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="quran"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MultiSelectFormField
                  options={parsedEditions}
                  defaultValue={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    updateQueryParam(value);
                  }}
                  placeholder="Select Quran Edition"
                  variant="secondary"
                />
              </FormControl>
              <FormDescription>
                Select the quran edition you want to view
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

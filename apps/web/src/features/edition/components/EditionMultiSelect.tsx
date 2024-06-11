"use client";

import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/src/components/ui/form";
import MultiSelectFormField from "@/src/components/ui/multi-select";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Edition } from "../api/editions";

interface EditionMultiSelectFormProps {
  edition: Edition[];
  queryParam: string;
  placeholder: string;
  formName: string;
  description: string;
}

export const EditionMultiSelectForm = (
  { edition, queryParam, placeholder, formName, description }: EditionMultiSelectFormProps,
) => {
  console.log({ edition });
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<{ quran: string[] }>({
    defaultValues: {
      quran: [],
    },
  });

  const parsedEditions = edition.map((edition) => ({
    label: edition.name,
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
                  placeholder={placeholder}
                  variant="secondary"
                />
              </FormControl>
              <FormDescription>
                {description}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

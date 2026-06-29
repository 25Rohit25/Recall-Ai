import React from "react";
import { useForm, FormProvider, UseFormReturn, UseFormProps, FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface FormWrapperProps<TFieldValues extends FieldValues = FieldValues, TContext = any>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  form: UseFormReturn<TFieldValues, TContext>;
  onSubmit: (data: TFieldValues) => void;
  children: React.ReactNode;
}

/**
 * Global form wrapper that integrates react-hook-form with standard HTML forms.
 * All forms in the application should use this to ensure consistent provider access.
 */
export function FormWrapper<TFieldValues extends FieldValues>({
  form,
  onSubmit,
  children,
  ...props
}: FormWrapperProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </FormProvider>
  );
}

/**
 * Utility hook to initialize a form with Zod schema validation.
 */
export function useZodForm<TSchema extends z.ZodType>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, "resolver">
) {
  return useForm<z.infer<TSchema>>({
    ...options,
    resolver: zodResolver(schema),
  });
}

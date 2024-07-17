import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

interface TextArea<T extends FieldValues>
  extends React.HTMLAttributes<HTMLTextAreaElement> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: React.ReactNode;
  disabled?: boolean;
}

const TextField = <T extends FieldValues>({
  name,
  description,
  label,
  placeholder,
  className,
  onChange,
  onBlur,
  disabled,
  ...rest
}: TextArea<T>) => {
  const form = useFormContext();
  return (
    <FormField
      control={form.control}
      name={name}
      disabled={!!disabled}
      render={({ field }) => {
        const handelChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          field.onChange(e);
          onChange && onChange(e);
        };
        const handleBlur = (
          e: React.FocusEvent<HTMLTextAreaElement, Element>
        ) => {
          field.onBlur();
          onBlur && onBlur(e);
        };
        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <Textarea
                placeholder={placeholder}
                className={cn("resize-none", className)}
                {...field}
                onChange={handelChange}
                onBlur={handleBlur}
                {...rest}
              />
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default TextField;

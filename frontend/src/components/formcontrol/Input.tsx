import { FieldValues, Path, PathValue, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import React from "react";

export interface InputControl<T extends FieldValues>
  extends React.HTMLAttributes<HTMLInputElement> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  type?: "text" | "number" | "file" | "number" | "email";
  defaultValue?: PathValue<T, Path<T>>;
}

const InputControl = <T extends FieldValues>({
  name,
  label,
  placeholder,
  description,
  onChange,
  onBlur,
  disabled,
  type = "text",
  defaultValue,
  ...rest
}: InputControl<T>) => {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      defaultValue={defaultValue}
      render={({ field }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          field.onChange(e);
          onChange && onChange(e);
        };
        const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
          field.onBlur();
          onBlur && onBlur(e);
        };
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Input
                placeholder={placeholder}
                {...field}
                onChange={handleChange}
                onBlur={handleBlur}
                {...rest}
                type={type}
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

export default InputControl;

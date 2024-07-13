import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Options } from "@/types/util";



interface Combobox<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeHolder?: string;
  options: Options[];
  disabled?: boolean;
  description?: string;
}

const Combobox = <T extends FieldValues>(props: Combobox<T>) => {
  const [open, setOpen] = React.useState(false);
  const form = useFormContext<FieldValues>();
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  return (
    <FormField
      name={props.name}
      control={form.control}
      disabled={!!props.disabled}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{props.label}</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                    ref={buttonRef}
                  >
                    {field.value
                      ? props.options.find((option) => option.value === field.value)
                          ?.label
                      : "Select " + props.placeHolder + "..."}
                    <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className="p-0"
                style={{ width: buttonRef?.current?.offsetWidth }}
              >
                <Command>
                  <CommandInput
                    placeholder={"Search " + props.placeHolder + "..."}
                    className="h-9"
                  />
                  <CommandEmpty>No {props.label ?? "Item"} found.</CommandEmpty>
                  <CommandGroup>
                    {props.options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        onSelect={(currentValue) => {
                          const data = props.options.find((x) =>
                            x.label.toLowerCase().includes(currentValue.toLowerCase())
                          );
                          form.setValue(
                            props.name,
                            (data?.label === field.value ? "" : data?.value) as any
                          );
                          if (currentValue) {
                            form.clearErrors(props.name);
                          }
                          setOpen(false);
                        }}
                      >
                        {option.label}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            field.value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription>{props.description}</FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default Combobox;

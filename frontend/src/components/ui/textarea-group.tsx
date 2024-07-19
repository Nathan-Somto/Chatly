import { cn } from "@/lib/utils";
import { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";

type Props<T extends FieldValues | {[id:string]: any}, U extends string>  = {
  label: U;
  id: U;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors;
  disabled?: boolean;
  width?: number;
  height?: number;
  resize?: boolean;
  className?: string;
};

function TextAreaGroup<T extends FieldValues | {[id:string]: any}, U extends string>({
  label,
  id,
  required,
  register,
  errors,
  disabled,
  height = 10,
  width = 10,
  resize = false,
  className
}: Props<T,U>) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block  font-medium leading-6 text-gray-900 dark:text-gray-100"
      >
        {label}
      </label>
      <div className="mt-2">
        <textarea
          id={id}
          autoComplete={id}
           cols={height}
           rows={width}
          disabled={disabled}
          {...register(id as unknown as Path<T>, { required })}
          className={cn(
            `block w-full px-3 resize-none rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-p2 sm:text-sm sm:leading-6 bg-input`,
            errors[id] && "focus:ring-rose-500",
            disabled && "opacity-50 cursor-default",
            resize && "resize",
            className
          )}
        />
      </div>
    </div>
  );
}
export default TextAreaGroup;
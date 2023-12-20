import { cn } from "@/lib/utils";
import { FieldErrors, FieldValues, Path, UseFormRegister } from "react-hook-form";

type Props<T extends FieldValues | {[id:string]: any}, U extends keyof T> = {
  label: U;
  id: U;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors;
  disabled?: boolean;
  className?:  string;
};

function InputGroup<T extends FieldValues | { [id: string]: any; }, U extends string>({
  label,
  id,
  type,
  required,
  register,
  errors,
  disabled,
  className
}: Props<T, U>) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block  font-medium leading-6 text-gray-900 dark:text-gray-100"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          autoComplete={id}
          disabled={disabled}
          {...register(id as unknown as Path<T>, { required })}
          className={cn(
            `block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-p2 sm:text-sm sm:leading-6 dark:bg-gray-900`,
            errors[id] && "focus:ring-rose-500",
            disabled && "opacity-50 cursor-default",
            className
          )}
        />
      </div>
    </div>
  );
}

export default InputGroup;
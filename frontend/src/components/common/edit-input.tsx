import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, Pencil } from "lucide-react";
import { useAutoGrowTextarea } from "@/hooks/useAutoGrowTextarea";
import { cn } from "@/lib/utils";
type Props = {
  label: string;
  onChange: (key: string, value: string) => void;
  defaultValue: string;
  isEditable?: boolean;
  isLinkable?: boolean;
  labelClassName?: string;
  showLabel?: boolean;
  inputClassName?: string
};
export default function EditInput({
  label,
  defaultValue,
  onChange,
  isLinkable=false,
  isEditable=true,
  showLabel=true,
  inputClassName="",
  labelClassName=""
}: Props) {
  const [enable, setEnable] = useState(false);
  const { textAreaRef } = useAutoGrowTextarea({ value: defaultValue });

  return (
    <div>
      {showLabel && (
        <label className={cn("text-gray-900 dark:text-gray-200 font-medium text-sm", labelClassName)}>
        {label}
      </label>
      )}
      <div className="relative mt-1">
        <textarea
          value={defaultValue}
          disabled={!enable}
          onChange={(e) => onChange(label.toLowerCase(), e.target.value)}
          rows={10}
          cols={10}
          contentEditable={isEditable}
          ref={textAreaRef}
          className={cn("w-full resize-none border-none overflow-hidden py-2  pr-10 pl-2 h-[20px]   placeholder-neutral-400 dark:text-gray-300 !bg-transparent text-gray-500 border border-gray-300 focus:border-transparent rounded-lg outline-none focus:ring-brand-p2 focus:ring-2", isLinkable && "!text-brand-p1  underline", inputClassName)}
        />
        {isEditable && (
        <Button
          onClick={() => setEnable((prevState) => !prevState)}
          variant={"ghost"}
          className="absolute right-0 top-0 mr-4 bottom-0 my-auto h-fit w-fit ml-4 p-0 text-gray-500"
        >
          {enable ? (
            <CheckIcon size={20} className="text-brand-p2" />
          ) : (
            <Pencil size={20} />
          )}
        </Button>
        )}
      </div>
    </div>
  );
}

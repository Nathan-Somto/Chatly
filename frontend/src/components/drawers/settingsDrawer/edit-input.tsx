import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon, Pencil } from "lucide-react";
import { useAutoGrowTextarea } from "@/hooks/useAutoGrowTextarea";
type Props = {
    label: string;
    defaultValue: string;
    onChange : (key: string, value: string) => void
  };
  export default function EditInput({ label, defaultValue, onChange }: Props) {
    const [enable, setEnable] = useState(false);
    const {
      textAreaRef
    } = useAutoGrowTextarea({value: defaultValue});
    
    return (
      <div>
        <label className="text-gray-900 dark:text-gray-200 font-medium text-sm">{label}</label>
        <div className="relative mt-1">
          <textarea
            value={defaultValue}
            disabled={!enable}
            onChange={(e) => onChange(label.toLowerCase(), e.target.value)}
            rows={10}
            cols={10}
            ref={textAreaRef}
            className="w-full resize-none overflow-hidden py-2  pr-9 pl-2 h-10   placeholder-neutral-400 dark:text-gray-300 !bg-transparent text-gray-500 border border-gray-300 focus:border-transparent rounded-lg outline-none focus:ring-brand-p2 focus:ring-2"
          />
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
        </div>
      </div>
    );
  }
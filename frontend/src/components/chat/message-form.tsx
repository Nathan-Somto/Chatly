import {
  CameraIcon,
  PaperclipIcon,
  SendHorizonalIcon,
  SmileIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
import { useAutoGrowTextarea } from "@/hooks/useAutoGrowTextarea";
import { cn } from "@/lib/utils";

function MessageForm() {
  const [body, setBody] = useState("");
  const hasStartedTyping = body.length > 0;
  const { textAreaRef } = useAutoGrowTextarea({ value: body });
  const hasReachedMaxHeight = useMemo(() => {
    if (textAreaRef.current) {
      return textAreaRef.current.clientHeight >= 80;
    }
    return false;
  }, [body]);
  return (
    <form className="bottom-0 justify-between bg-gray-100 dark:bg-gray-800 fixed w-full p-3 min-h-12 lg:w-[calc(100%-350px)] lg:ml-[350px] inset-x-0 border border-t flex items-center">
      {/* Emoji Picker */}
      <Button
        type="button"
        variant={"ghost"}
        className="text-neutral-400 text-[20px]"
      >
        <SmileIcon />
      </Button>
      <textarea
        id="body"
        name="body"
        ref={textAreaRef}
        placeholder="type a message..."
        value={body}
        onChange={(e) => {
          setBody(e.target.value)
          if (textAreaRef.current) {
            if(textAreaRef.current.clientHeight > textAreaRef.current.scrollHeight){
              textAreaRef.current.style.height = `40px`
            }
          }
        }}
        onKeyDown={(e) => {
          console.log(e.code === "ENTER");
        }}
        className={cn(
          "w-[70%] max-sm:max-w-[300px] max-sm:w-[80%] flex-shrink-0 outline-none focus:border-none placeholder-neutral-400 bg-transparent h-10 dark:text-gray-200 text-gray-700 resize-none max-h-20  overflow-hidden",
          hasReachedMaxHeight && "overflow-auto h-32"
        )}
      />
      {hasStartedTyping ? (
        <Button size="icon" className="rounded-full p-2 shadow-md h-9 w-9 flex-shrink-0 text-[20px] bg-brand-p2 text-white hover:bg-[rgb(102,174,233)] delay-150">
          <SendHorizonalIcon />
        </Button>
      ) : (
        <div className="flex items-center gap-[0.35rem] text-[20px] text-neutral-400">
          <Button type="button" variant={"ghost"}>
            <PaperclipIcon />
          </Button>
          <Button type="button" variant={"ghost"}>
            <CameraIcon />
          </Button>
        </div>
      )}
    </form>
  );
}

export default MessageForm;

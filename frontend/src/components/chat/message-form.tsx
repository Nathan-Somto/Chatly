import {
  CameraIcon,
  PaperclipIcon,
  SendHorizonalIcon,
  SmileIcon,
} from "lucide-react";
import { Button } from "../ui/button";
import { useMemo, useState, useRef } from "react";
import { useAutoGrowTextarea } from "@/hooks/useAutoGrowTextarea";
import { cn } from "@/lib/utils";
import { useMessages } from "@/hooks/useMessages";
import { avatar2 } from "@/assets";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";

function MessageForm() {
  const {chatId} = useParams();
  const [body, setBody] = useState("");
  const hasStartedTyping = body.length > 0;
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { textAreaRef } = useAutoGrowTextarea({ value: body });
  const { addMessage,messages, setMessages } = useMessages((state) => state);
  const hasReachedMaxHeight = useMemo(() => {
    if (textAreaRef.current) {
      return textAreaRef.current.clientHeight >= 80;
    }
    return false;
  }, [body]);
  function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    if(body.length  === 0) return;
    try{
      const message: typeof messages[number] = {
        Sender: {
          username: "Nathan_Somto",
          avatar: avatar2,
          id: "user1",
          Member: [
            {
              role : "MEMBER"
            }
          ]
        },
        body,
        chatId: chatId ?? "",
        createdAt: new Date(),
        id: v4(),
        isEditted: false,
        readByIds: [],
        resourceUrl : null,
        senderId: "user1",
        type: "TEXT"
      }
      // optimistic update with sending;
        addMessage(message)
      // store in db;
      // emit chat through socket.io;
      // change state to sent;
      setBody("")
    }
    catch(err){
      // set failed to true.
    }
  }
  return (
    <form onSubmit={onSubmit} className="bottom-0 justify-between bg-gray-100 dark:bg-gray-800 fixed w-full p-3 min-h-12 lg:w-[calc(100%-350px)] lg:ml-[350px] inset-x-0 border border-t flex items-center">
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
          if(e.code === "Enter" && buttonRef.current !== null){
            buttonRef.current.click(); 
          }
        }}
        className={cn(
          "w-[70%] max-sm:max-w-[300px] max-sm:w-[80%] flex-shrink-0 outline-none focus:border-none placeholder-neutral-400 bg-transparent h-10 dark:text-gray-200 text-gray-700 resize-none max-h-20  overflow-hidden",
          hasReachedMaxHeight && "overflow-auto h-32"
        )}
      />
      {hasStartedTyping ? (
        <Button ref={buttonRef} size="icon" className="rounded-full p-2 shadow-md h-9 w-9 flex-shrink-0 text-[20px] bg-brand-p2 text-white hover:bg-[rgb(102,174,233)] delay-150">
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

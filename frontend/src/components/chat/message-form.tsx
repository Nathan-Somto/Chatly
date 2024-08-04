import {
  CameraIcon,
  PaperclipIcon,
  PenIcon,
  ReplyIcon,
  SendHorizonalIcon,
  SmileIcon,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  useMemo,
  useState,
  useRef,
  memo,
  useTransition,
  useEffect,
} from "react";
import { useAutoGrowTextarea } from "@/hooks/useAutoGrowTextarea";
import { cn, displayError } from "@/lib/utils";
import { ModifiedMessage, useMessages } from "@/hooks/useMessages";
import { useParams } from "react-router-dom";
import { v4 } from "uuid";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  PickerProps,
  Theme,
} from "emoji-picker-react";
import { useTheme } from "../wrappers/theme-provider";
import { useMessageOptions } from "@/hooks/useMessageOptions";
import { useMutate } from "@/hooks/query/useMutate";
import { useProfileStore } from "@/hooks/useProfile";
import {
  CreateMessagePayload,
  EditMessagePayload,
  MessageEmit,
} from "@/api-types";
import useSocketStore from "@/hooks/useSocket";
import { useActiveChat } from "@/hooks/useActiveChat";
import { AxiosResponse } from "axios";
import UploadWidget from "../common/upload-widget";
import toast from "react-hot-toast";
const MemoEmojiPicker = memo(({ ...props }: PickerProps) => (
  <EmojiPicker {...props} />
));

function MessageForm() {
  const {
    messageOptions: { editMessage, replyTo },
    onReply,
    onEdit,
  } = useMessageOptions();
  const { chatId } = useParams();
  const [body, setBody] = useState("");
  const hasStartedTyping = body.length > 0;
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const resourceUrlOverlayRef = useRef<HTMLDivElement | null>(null);
  const { textAreaRef } = useAutoGrowTextarea({ value: body });
  const [showEmojiPicker, setEmojiPicker] = useState<boolean>(false);
  const [_emojiPickerObject, setEmojiPickerObject] =
    useState<EmojiClickData | null>(null);
  const [isPending, startTransition] = useTransition();
  const { theme } = useTheme();
  const isReply = replyTo !== null;
  const isEditting = editMessage !== null;
  const { profile } = useProfileStore();
  const { addMessage, messages, setMessages } = useMessages();
  // "http://res.cloudinary.com/dvw2zx08k/image/upload/v1722588927/media/chats/somto-profile-pic_iv1gcq.png"
  const [resourceUrl, setResourceUrl] = useState<string | null>(
    null
  );
  const [resource_type, setResourceType] = useState<"image" | "video">("image");
  const { socket } = useSocketStore();
  const { activeChat } = useActiveChat();
  useEffect(() => {
    if (textAreaRef.current && resourceUrlOverlayRef.current) {
      resourceUrlOverlayRef.current.style.height = `calc(100vh - (${textAreaRef.current.clientHeight}px + 27px))`;
    }
  }, [body]);
  useEffect(() => {
    if (editMessage?.text) {
      setBody(editMessage.text);
    }
  }, [editMessage]);
  function onSuccess(response: AxiosResponse<any, any>) {
    // find the message which is sending and update it to sent
    const foundMessage = messages.find((message) => message.sending);
    if (foundMessage) {
      const messagesCopy = messages.slice();
      foundMessage.id = response.data?.message?.id;
      foundMessage.sending = false;
      setMessages(messagesCopy);
    }
  }
  function onError() {
    // find the message which is sending and update it to failed
    const foundMessage = messages.find((message) => message.sending);
    if (foundMessage) {
      const messagesCopy = messages.slice();
      foundMessage.sending = false;
      foundMessage.failed = true;
      setMessages(messagesCopy);
    }
  }
  function onUploadComplete(result: string, resource_type: "image" | "video") {
    setResourceUrl(result);
    setResourceType(resource_type);
  }
  function onUploadError(err: any) {
    toast.error(displayError(err, "could not upload resource"));
  }
  const { mutate: postMutate, isPending: isPosting } = useMutate({
    defaultMessage: "Failed to send message",
    method: "post",
    route: "/messages",
    onSuccess,
    onError,
    displayToast: false,
  });
  const { mutate: patchMutate, isPending: isPatching } = useMutate({
    defaultMessage: "Failed to edit message",
    method: "patch",
    route: `/messages/${editMessage?.id}`,
  });
  const disableBtn = isPosting || isPatching;
  const hasReachedMaxHeight = useMemo(() => {
    if (textAreaRef.current) {
      return textAreaRef.current.clientHeight >= 80;
    }
    return false;
  }, [body]);
  function closeOption() {
    onReply(null);
    onEdit(null);
    if (isEditting) {
      setBody("");
    }
  }
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (body.length === 0 || !profile || !chatId) return;
    const resource_type_map : {
      [key : string]: MessageType
    } = {
      "image": 'IMAGE',
      "video": "VIDEO"
    }
    try {
      let optimisticMessage: ModifiedMessage = {
        Sender: {
          username: profile.username,
          avatar: profile.avatar,
          id: profile.id,
          Member: [
            {
              role: "MEMBER",
            },
          ],
        },
        body,
        chatId,
        id: v4(),
        createdAt: new Date(),
        isEditted: false,
        readByIds: [],
        resourceUrl,
        senderId: profile?.id ?? null,
        type: resourceUrl !== null ? resource_type_map[resource_type] : "TEXT",
        sending: true,
        isReply,
        parentMessage: null,
      };
      // if it is a reply message
      if (isReply) {
        optimisticMessage.parentMessage = {
          body: replyTo?.text,
          avatar: replyTo?.avatar,
          username: replyTo?.username,
        };
      }
      // optimistic update with sending;
      if (isEditting) {
        // find the message
        const messagesCopy = messages.slice();
        const foundMessage = messagesCopy[editMessage.index];
        foundMessage.isEditted = true;
        foundMessage.body = body;
        foundMessage.sending = true;
        optimisticMessage = foundMessage;
        setMessages(messagesCopy);
      } else {
        addMessage(optimisticMessage);
      }
      // store in db;
      let chatInfo: MessageEmit['chatInfo'] = {
        id: chatId,
        isGroup: activeChat?.groupInfo?.isGroup ?? false,
        name: activeChat?.dmInfo?.username ?? activeChat?.groupInfo?.name ?? "",
        // ensure avatars is always string[]
        avatars: activeChat?.groupInfo?.avatars ?? [
          activeChat?.dmInfo?.avatar ?? "",
        ],
        description: activeChat?.groupInfo?.description,
        inviteCode: activeChat?.groupInfo?.inviteCode
      };
      let createMessagePayload: CreateMessagePayload = {
        body,
        chatId,
        // add the parent id to the message payload
        parentMessageId: replyTo?.parentId ?? null,
        resourceUrl: null,
        userId: profile.id,
        type: "TEXT",
      };
      let editMessagePayload: EditMessagePayload = {
        body,
        chatId,
        userId: profile.id,
      };
      if (isEditting) {
        patchMutate(editMessagePayload);
      } else {
        postMutate(createMessagePayload);
      }
      // emit chat through socket.io;
      let messageEmit: MessageEmit = {
        chatInfo,
        message: optimisticMessage,
      };
      delete (messageEmit.message as ModifiedMessage).sending;
      if (isEditting) {
      } else {
        socket?.emit("sendMessage", messageEmit);
      }
      // change state to sent via the onSuccess;
      if (isEditting || isReply) {
        closeOption();
      }
      setBody("");
      setResourceUrl(null);
      setResourceType("image");
    } catch (err) {
      console.log(err);
    }
  }
  function handleEmojiClick(emojiDataObj: EmojiClickData, _: MouseEvent) {
    // append emoji to text area value.
    const updatedValue = body + emojiDataObj.emoji;
    setEmojiPickerObject(emojiDataObj);
    setBody(updatedValue);
  }
  function toggleEmojiPicker() {
    // toggle emoji appearance
    startTransition(() => {
      setEmojiPicker((prevState) => !prevState);
    });
  }
  return (
    <div className="bottom-0 z-[10] justify-between bg-gray-100 dark:bg-[#17191C] fixed w-full p-3 min-h-12 lg:w-[calc(100%-350px)] lg:ml-[350px] inset-x-0 border border-t ">
      {(replyTo !== null || editMessage !== null) && (
        <div className="flex gap-x-2.5 relative mb-3">
          <div className="text-brand-p1/80">
            {replyTo ? (
              <ReplyIcon className="h-8 w-8" />
            ) : (
              editMessage && <PenIcon className="h-7 w-7" />
            )}
          </div>
          <div>
            <p className="font-semibold text-brand-p1 text-[15.5px]">
              {replyTo
                ? `Reply to ${replyTo.username}`
                : editMessage
                ? "Edit Message"
                : null}
            </p>
            <p className="line-clamp-1 text-sm">
              {editMessage?.text ?? replyTo?.text}
            </p>
          </div>
          <Button
            onClick={closeOption}
            size={"icon"}
            className="absolute h-7 w-7 top-0 right-2 dark:text-gray-200 text-gray-800"
            variant={"ghost"}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}
      <div
        className={cn(
          "absolute top-[-350px] left-0 z-[50]",
          !showEmojiPicker && "hidden"
        )}
      >
        <MemoEmojiPicker
          emojiStyle={EmojiStyle.FACEBOOK}
          onEmojiClick={handleEmojiClick}
          className="bg-background"
          height={350}
          theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
        />
      </div>
      {resourceUrl !== null && (
        <div
          ref={resourceUrlOverlayRef}
          className="fixed top-0 h-[calc(100vh-67px)] lg:w-[calc(100%-350px)]  lg:ml-[350px] left-0 right-0 p-0 w-full bg-black/50 z-[20] bg-opacity-50"
        >
          <div className="absolute rounded-md  overflow-hidden hover:opacity-80 ease-in top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4 z-[50] h-[350px] w-[350px]">
            <Button
              onClick={() => setResourceUrl(null)}
              size={"icon"}
              className="absolute h-7 w-7 top-2 right-2 dark:text-gray-200 bg-gray-800 rounded-full"
              variant={"ghost"}
            >
              <X className="h-5 w-5" />
            </Button>
            {resource_type === "image" ? (
              <img
                src={resourceUrl}
                className="w-full h-full object-cover mx-auto"
              />
            ) : (
              <video
                src={resourceUrl}
                className="w-full h-full object-cover mx-auto"
                controls
              />
            )}
          </div>
        </div>
      )}
      <form
        onSubmit={onSubmit}
        className="flex items-center justify-between w-full relative z-[10000]"
      >
        {/* Emoji Picker */}
        <Button
          type="button"
          variant={"ghost"}
          onClick={toggleEmojiPicker}
          disabled={isPending}
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
            setBody(e.target.value);
            if (textAreaRef.current && resourceUrlOverlayRef.current) {
              if (
                textAreaRef.current.clientHeight >
                textAreaRef.current.scrollHeight
              ) {
                textAreaRef.current.style.height = `40px`;
                resourceUrlOverlayRef.current.style.height = `calc(100vh - 70px)`;
              }
            }
          }}
          onKeyDown={(e) => {
            if (
              e.code === "Enter" &&
              buttonRef.current !== null &&
              !disableBtn
            ) {
              buttonRef.current.click();
            }
          }}
          className={cn(
            "w-[70%] max-sm:max-w-[300px] max-sm:w-[80%] flex-shrink-0 outline-none focus:border-none placeholder-neutral-400 bg-transparent h-10 dark:text-gray-200 text-gray-700 resize-none max-h-20  overflow-hidden",
            hasReachedMaxHeight && "overflow-auto h-32"
          )}
        />
        {hasStartedTyping ? (
          <Button
            ref={buttonRef}
            disabled={disableBtn}
            size="icon"
            className="rounded-full p-2 shadow-md h-9 w-9 flex-shrink-0 text-[20px] bg-brand-p2 text-white hover:bg-[rgb(102,174,233)] delay-150"
          >
            <SendHorizonalIcon />
          </Button>
        ) : (
          <div className="flex items-center gap-[0.35rem] text-[20px] text-neutral-400">
            <Button type="button" variant={"ghost"}>
              <PaperclipIcon />
            </Button>
            <UploadWidget
              onUploadComplete={onUploadComplete}
              onError={onUploadError}
            >
              <Button type="button" variant={"ghost"}>
                <CameraIcon />
              </Button>
            </UploadWidget>
          </div>
        )}
      </form>
    </div>
  );
}

export default MessageForm;

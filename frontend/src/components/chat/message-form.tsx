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
import { useMemo, useState, useRef, useTransition, useEffect } from "react";
import { useAutoGrowTextarea } from "@/hooks/useAutoGrowTextarea";
import { cn, createOptimisticMessage, displayError } from "@/lib/utils";
import { ModifiedMessage, useMessages } from "@/hooks/useMessages";
import { useParams } from "react-router-dom";
import { EmojiClickData, EmojiStyle, Theme } from "emoji-picker-react";
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
import { MemoEmojiPicker } from "./memo-emoji-picker";
import useChatStore from "@/hooks/useChats";
import { ChatBoxMessageType, ChatBoxType } from "../chats";

function MessageForm() {
  const {
    messageOptions: { editMessage, replyTo },
    resetOptions
  } = useMessageOptions();
  const { chatId } = useParams();
  const [body, setBody] = useState("");
  const hasStartedTyping = body.length > 0;
  // refs
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const resourceUrlOverlayRef = useRef<HTMLDivElement | null>(null);
  const { textAreaRef } = useAutoGrowTextarea({ value: body });
  const edittedMsgBodyRef = useRef<string | null>(null);
  const oldMessageRef = useRef<ChatBoxMessageType | null>(null);
  const [showEmojiPicker, setEmojiPicker] = useState<boolean>(false);
  const [_emojiPickerObject, setEmojiPickerObject] =
    useState<EmojiClickData | null>(null);
  const [isPending, startTransition] = useTransition();
  const isReply = replyTo !== null;
  const isEditting = editMessage !== null;
  const [resourceUrl, setResourceUrl] = useState<string | null>(null);
  const [resource_type, setResourceType] = useState<"image" | "video">("image");
  const [isSending, setIsSending] = useState<boolean>(false);
  // bounded store
  const { theme } = useTheme();
  const { chatList, setChatList } = useChatStore();
  const { profile } = useProfileStore();
  const { messages, setMessages } = useMessages();
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
  }, [editMessage?.text]);
  function onSuccess(
    responseData: AxiosResponse<any, any>["data"],
    messagesCopy: ModifiedMessage[],
    index?: number
  ) {
    if (messagesCopy.length === 0) return;
    // find the message which is sending and update it to sent
    let position = index !== undefined ? index : messagesCopy.length - 1;
    const foundMessage = messagesCopy[position];
    if (foundMessage && responseData.data?.id) {
      foundMessage.id = responseData.data?.id;
      foundMessage.sending = false;
      foundMessage.failed = false;
      setMessages(messagesCopy);
      const { groupInfo, dmInfo } = activeChat;
      let chatInfo: MessageEmit["chatInfo"] = {
        id: chatId ?? "",
        isGroup: true,
        name: groupInfo?.name ?? "",
        imageUrl: groupInfo?.imageUrl ?? null,
        description: groupInfo?.description,
        inviteCode: groupInfo?.inviteCode,
        privacy: groupInfo?.privacy ?? null,
        members: groupInfo?.members ?? [],
      };
      // this means it is a dm
      if (dmInfo) {
        chatInfo.name = profile?.username ?? "";
        chatInfo.avatarUrl = profile?.avatar ?? null;
        chatInfo.bio = profile?.bio ?? null;
        chatInfo.email = profile?.email ?? null;
        chatInfo.lastSeen = new Date();
        chatInfo.isGroup = false;
      }
      // emit chat through socket.io;
      let messageEmit: MessageEmit = {
        chatInfo,
        message: { ...foundMessage },
      };
      delete (messageEmit.message as ModifiedMessage).sending;
      delete (messageEmit.message as ModifiedMessage).failed;
      if (isEditting) {
        socket?.emit("updateMessage", messageEmit);
      } else {
        socket?.emit("sendMessage", messageEmit);
      }
      oldMessageRef.current = null;
    }
  }
  function onError(
    messagesCopy: ModifiedMessage[],
    chatListCopy: ChatBoxType[]
  ) {
    // find the message which is sending and update it to failed
    const foundMessage = messages?.find((message) => message.sending);
    // find the chat list that the message belongs to
    const chatIndex = chatListCopy.findIndex((chat) => chat.id === chatId);
    if (chatIndex === -1) return;
    const chat = chatListCopy[chatIndex];
    chat.message = oldMessageRef.current ?? chat.message;
    oldMessageRef.current = null;
    if (foundMessage) {
      if (isEditting && edittedMsgBodyRef) {
        foundMessage.body = edittedMsgBodyRef.current;
        edittedMsgBodyRef.current = body;
      }
      foundMessage.sending = false;
      foundMessage.failed = true;
      setMessages(messagesCopy);
    }
    setChatList(chatListCopy);
  }
  function onUploadComplete(result: string, resource_type: "image" | "video") {
    setResourceUrl(result);
    setResourceType(resource_type);
  }
  function onUploadError(err: any) {
    toast.error(displayError(err, "could not upload resource"));
  }
  const { mutateAsync: postMessage } = useMutate({
    defaultMessage: "Failed to send message",
    method: "post",
    route: "/messages",
    displayToast: false,
  });
  const { mutateAsync: patchMessage } = useMutate({
    defaultMessage: "Failed to edit message",
    method: "patch",
    route: `/messages/${editMessage?.id}`,
    displayToast: false,
  });
  const disableBtn = isSending;
  const hasReachedMaxHeight = useMemo(() => {
    if (textAreaRef.current) {
      return textAreaRef.current.clientHeight >= 80;
    }
    return false;
  }, [body]);
  function closeOption() {
    if (isEditting || isReply) {
     resetOptions();
    }
  }
  function resetMessageForm() {
    setBody("");
    setResourceUrl(null);
    setResourceType("image");
  }
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (body.length === 0 || !profile || !chatId) return;
    if (isEditting && !editMessage) return;
    if (!socket) return;
    setIsSending(true);
    const messagesCopy = messages?.slice() ?? [];
    const chatListCopy = chatList.slice();
    try {
      const optimisticMessage = createOptimisticMessage(
        profile,
        body,
        chatId,
        resourceUrl,
        resource_type,
        isReply,
        replyTo
      );
      // optimistic update with sending;
      // find the chat list that the message belongs to
      const chatIndex = chatListCopy.findIndex((chat) => chat.id === chatId);
      if (chatIndex === -1) return;
      const chat = chatListCopy[chatIndex];
      oldMessageRef.current = chat.message;

      if (isEditting) {
        const foundMessage = messagesCopy[editMessage.index];
        if (!foundMessage) return;
        edittedMsgBodyRef.current = foundMessage.body;
        foundMessage.isEditted = true;
        foundMessage.body = body;
        foundMessage.sending = true;
        if (chat.message.id === foundMessage.id) {
          chat.message.body = foundMessage.body;
        }
      } else {
        chat.message = {
          id: optimisticMessage.id,
          body: optimisticMessage.body,
          createdAt: optimisticMessage.createdAt,
          readByIds: [],
          senderId: optimisticMessage.senderId,
          type: optimisticMessage.type,
        };
        messagesCopy.push(optimisticMessage);
      }
      setMessages(messagesCopy);
      setChatList(chatListCopy);
      // store in db;
      let createMessagePayload: CreateMessagePayload = {
        body,
        chatId,
        parentMessageId: replyTo?.parentId ?? null,
        resourceUrl: optimisticMessage.resourceUrl,
        userId: profile.id,
        type: optimisticMessage.type,
      };
      let editMessagePayload: EditMessagePayload = {
        body,
        chatId,
        userId: profile.id,
      };
      resetMessageForm();
      let response: AxiosResponse<any, any> | undefined;
      if (isEditting) {
        response = await patchMessage(editMessagePayload);
      } else {
        response = await postMessage(createMessagePayload);
      }
      if (!response.data) {
        throw new Error("message failed to send");
      }
      onSuccess(response.data, messagesCopy, editMessage?.index);
    } catch (err) {
      onError(messagesCopy, chatListCopy);
      console.log(err);
    } finally {
      closeOption();
      setIsSending(false);
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
            onClick={() => {
              resetMessageForm();
              closeOption();
            }}
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
            "w-[70%] max-sm:max-w-[300px] flex-shrink-0 outline-none focus:border-none placeholder-neutral-400 bg-transparent h-10 dark:text-gray-200 text-gray-700 resize-none max-h-20  overflow-hidden",
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

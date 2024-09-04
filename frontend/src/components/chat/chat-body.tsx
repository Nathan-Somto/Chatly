import { MessageSquareIcon } from "lucide-react";
import P from "../ui/typo/P";
import { ModifiedMessage, useMessages } from "@/hooks/useMessages";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useMemo, useRef, useState } from "react";
import MediaViewModal from "../modals/media-viewer-modal";
import useSocketStore from "@/hooks/useSocket";
import { MessageDeleteEmit } from "@/api-types";
import Message from "./message";
import { useParams } from "react-router-dom";
import Loader from "../ui/loader";
import { useMessageOptions } from "@/hooks/useMessageOptions";
import DeleteModal from "../modals/delete-modal";
import { useScrollTo } from "@/hooks/useScrollTo";
import { useMutate } from "@/hooks/query/useMutate";
import { useProfileStore } from "@/hooks/useProfile";
import { useChatBodyListeners } from "@/hooks/listeners/useChatBodyListeners";
import useInfiniteQuery from "@/hooks/query/useInfiniteQuery";
import { renderChatWallpaper } from "@/lib/utils";

function ChatBody() {
  const [openImgModal, setOpenImgModal] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const { chatId } = useParams<{ chatId: string }>();
  const { messages, setMessages } = useMessages();
  const { socket } = useSocketStore();
  const removedMessage = useRef<ModifiedMessage | null>(null);
  const { profile } = useProfileStore();
  const { scrollToRef, scrollToBottom, hasNewMessage } = useScrollTo({
    scrollOnMount: true,
  });
  const wallpaperStyle = useMemo(() => {
    return renderChatWallpaper(
      profile?.wallpaperType ?? "DEFAULT",
      profile?.wallpaperUrl ?? ""
    );
  }, [profile?.wallpaperType, profile?.wallpaperUrl]);
  function openImageModal(src: string) {
    setOpenImgModal(true);
    setImgSrc(src);
  }
  const {
    data: response,
    isPending: isFetching,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery<"messages", Message>({
    enabled: true,
    route: `/chats/${chatId}/messages`,
    queryKey: ["messages", chatId],
  });
  const {
    toggleDeleteModal,
    messageOptions: {
      deleteModal: { id, open, index },
    },
    resetOptions,
    toggleDisabled,
  } = useMessageOptions();
  const { mutateAsync: deleteMessage, isPending: isDeleting } =
    useMutate<undefined>({
      method: "delete",
      route: `/messages/${id ?? removedMessage.current?.id}`,
      defaultMessage: "Failed to delete message",
      displayToast: false,
    });
  function onDeleteSuccess(messagesCopy: Message[], prevIndex: number) {
    console.log(
      "messages copy and prevIndex in delete error",
      messagesCopy,
      prevIndex
    );
    if (chatId === undefined || profile?.id === undefined) return;
    // get the prev message  from the deleted
    const prevMessage =
      messagesCopy.length === 0 || prevIndex > messagesCopy.length - 1
        ? null
        : messagesCopy[prevIndex];
    const deleteEmit: MessageDeleteEmit = {
      deletedMessageId: id,
      prevMessage: prevMessage ?? null,
      chatId,
      userId: profile?.id,
    };
    // emit the socket event to delete the message
    socket?.emit("deleteMessage", deleteEmit);
    // reset the message options state
    resetOptions();
    removedMessage.current = null;
  }
  function onDeleteError(messagesCopy: Message[], prevIndex: number) {
    if (!removedMessage.current) return;
    setMessages(
      messagesCopy.splice(prevIndex, 0, removedMessage.current) ?? null
    );
    resetOptions();
    removedMessage.current = null;
  }
  // get the messages from the server
  useEffect(() => {
    if (response?.pages && response?.pages?.length) {
      const msgsData = response.pages
        .flatMap((page) => page?.data.messages)
        .filter((message) => message !== undefined);
      // add the new messages to the store
      console.log("data in chat body: ", msgsData);
      if (msgsData !== undefined) {
        msgsData.reverse()
        setMessages(msgsData as Message[]);
      }
      if (response.pages.length === 1) {
        scrollToBottom();
      }
    }
  }, [response, chatId]);
  // attach a socket io listener for new messages, updates and deletions
  useChatBodyListeners({ hasNewMessage, attachListeners: true });
  async function handleDelete() {
    toggleDisabled(true);
    const messageCopy = messages?.slice() ?? [];
    try {
      // remove from the store
      console.log("delete modal: ", id, index);
      const message = messageCopy.length > 0 ? null : messageCopy[index];
      messageCopy?.splice(index, 1);
      removedMessage.current = message;
      // update ui
      setMessages(messageCopy);
      // remove from the server
      await deleteMessage();
      onDeleteSuccess(messageCopy, index - 1);
    } catch (err) {
      onDeleteError(messageCopy, index - 1);
    }
  }
  function openDeleteModal(val: boolean) {
    toggleDeleteModal({
      id,
      open: val,
      index,
    });
  }
  return (
    <>
      <section
        style={{
          ...wallpaperStyle,
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="mt-[75px] min-h-screen mb-16 relative"
      >
        {isFetching || messages === null ? (
          <div className="h-screen flex items-center justify-center">
            <Loader withBackground={false} size="sm" />
          </div>
        ) : messages?.length == 0 ? (
          <div className="h-screen grid place-items-center content-center">
            <figure className="mb-5">
              <MessageSquareIcon
                className="text-gray-800 dark:text-gray-50 rotate-[360deg]"
                size={96}
              />
            </figure>
            <P className="font-medium opacity-90 text-gray-800 dark:text-gray-50">
              No messages here yet...
            </P>
          </div>
        ) : (
          <>
            {hasNextPage && (
              <div className="flex justify-center">
                {isFetchingNextPage ? (
                  <Loader withBackground={false} size="sm" />
                ) : (
                  <button
                    onClick={() => fetchNextPage()}
                    className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs
                            my-4 dark:hover:text-zinc-300 transition"
                  >
                    Load previous messages
                  </button>
                )}
              </div>
            )}
            {messages?.map((item, index) => {
              if (item.type === "SYSTEM") {
                return (
                  <div key={index} className="flex justify-center my-8">
                    <P className="bg-brand-p1/80 dark:bg-[rgb(60,116,161)]/80 text-white py-2 px-4 rounded-3xl">
                      {item.body}
                    </P>
                  </div>
                );
              } else {
                return (
                  <Message
                    {...item}
                    sending={item?.sending}
                    failed={item?.failed}
                    openModal={openImageModal}
                    key={uuidv4()}
                    index={index}
                  />
                );
              }
            })}
          </>
        )}
      </section>
      <MediaViewModal
        src={imgSrc}
        open={openImgModal}
        setOpen={setOpenImgModal}
      />
      <DeleteModal
        deleteFn={handleDelete}
        open={open}
        onOpenChange={openDeleteModal}
        isPending={isDeleting}
        title="Delete Message"
        message="Are you sure you want to delete this message?"
      />
      <div ref={scrollToRef}></div>
    </>
  );
}

export default ChatBody;

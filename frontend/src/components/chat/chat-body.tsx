import { DarkWall, LightWall } from "@/assets";
import { useTheme } from "../wrappers/theme-provider";
import { MessageSquareIcon } from "lucide-react";
import P from "../ui/typo/P";
import { ModifiedMessage, useMessages } from "@/hooks/useMessages";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef, useState } from "react";
import MediaViewModal from "../modals/media-viewer-modal";
import useSocketStore from "@/hooks/useSocket";
import {
  GetMessagesResponse,
  MessageDeleteEmit,
  MessageEmit,
} from "@/api-types";
import Message from "./message";
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { useParams } from "react-router-dom";
import Loader from "../ui/loader";
import { useActiveChat } from "@/hooks/useActiveChat";
import { useMessageOptions } from "@/hooks/useMessageOptions";
import DeleteModal from "../modals/delete-modal";
import { useScrollTo } from "@/hooks/useScrollTo";
import { useMutate } from "@/hooks/query/useMutate";
import { useProfileStore } from "@/hooks/useProfile";

function ChatBody() {
  const [openImgModal, setOpenImgModal] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const { theme } = useTheme();
  const { chatId } = useParams<{ chatId: string }>();
  const { messages, addMessage, setMessages } = useMessages();
  const { activeChat } = useActiveChat();
  const { socket } = useSocketStore();
  const removedMessage = useRef<ModifiedMessage | null>(null);
  const { profile } = useProfileStore();
  const { scrollToRef } = useScrollTo({
    triggerValues: [messages],
    scrollOnMount: true,
  });
  function openImageModal(src: string) {
    setOpenImgModal(true);
    setImgSrc(src);
  }
  const {
    data: response,
    isPending: isFetching,
    refetch,
  } = useGetQuery<GetMessagesResponse>({
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
  function onDeleteSuccess(
    messagesCopy: Message["message"][],
    prevIndex: number
  ) {
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
    console.log("prevMessage in on delete success: ", prevMessage);
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
  function onDeleteError(
    messagesCopy: Message["message"][],
    prevIndex: number
  ) {
    console.log(
      "messages copy and prevIndex in delete error",
      messagesCopy,
      prevIndex
    );
    if (!removedMessage.current) return;
    setMessages(
      messagesCopy.splice(prevIndex, 0, removedMessage.current) ?? null
    );
    resetOptions();
    removedMessage.current = null;
  }
  // Clear messages when activeChat changes
  /*  useEffect(() => {
    setMessages(null);
    if (activeChat?.dmInfo || activeChat?.groupInfo) {
      refetch();
    }
  }, [chatId]); */
  // get the messages from the server
  useEffect(() => {
    const data = response?.data;
    if (data) {
      setMessages(data.messages);
    }
  }, [response, chatId]);
  // attach a socket io listener for new messages
  useEffect(() => {
    if (socket) {
      // helper function that return a boolean ifwe should add the Message
      const includeMessage = (
        messageId: string,
        chatId: string,
        checkFound = true
      ) => {
        let found;
        if (checkFound) {
          found = messages?.find((item) => item.id === messageId);
        }
        // if the chat info of the new message does not match the active chat id don't add it to the state
        const isDmChat = activeChat?.dmInfo?.id === chatId;
        const isGroupChat = activeChat?.groupInfo?.id === chatId;

        if (!(isDmChat || isGroupChat)) {
          return false;
        }
        if (checkFound) {
          if (found) {
            return false;
          }
        }
        return true;
      };
      const handleNewMessage = (data: MessageEmit) => {
        console.log("handle new  message: ", data);
        if (!includeMessage(data.message.id, data.chatInfo.id)) return;
        addMessage(data.message);
      };
      const handleUpdateMessage = (data: MessageEmit) => {
        console.log("update message: ", data);
        if (!includeMessage(data.message.id, data.chatInfo.id, false)) return;
        const foundMessage = messages?.find(
          (item) => item.id === data.message.id
        );
        if (foundMessage) {
          const updatedMessages =
            messages?.map((item) => {
              if (item.id === data.message.id) {
                return data.message;
              }
              return item;
            }) ?? null;
          setMessages(updatedMessages);
        }
      };
      const handleDeleteMessage = (data: MessageDeleteEmit) => {
        if (!includeMessage(data.deletedMessageId, data.chatId, false)) return;
        const foundMessage = messages?.find(
          (item) => item.id === data.deletedMessageId
        );
        if (foundMessage) {
          const messageCopy =
            messages?.filter((item) => item.id !== data.deletedMessageId) ??
            null;
          setMessages(messageCopy);
        }
      };
      socket?.on("messageDeleted", handleDeleteMessage);
      socket?.on("messageUpdated", handleUpdateMessage);
      socket?.on("newMessage", handleNewMessage);
      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.off("messageUpdated", handleUpdateMessage);
        socket.off("messageDeleted", handleDeleteMessage);
      };
    }
  }, [socket, chatId]);
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
          backgroundImage: `url(${theme === "dark" ? DarkWall : LightWall})`,
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
          messages?.map((item, index) => {
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
                  message={item}
                  sending={item?.sending}
                  failed={item?.failed}
                  openModal={openImageModal}
                  key={uuidv4()}
                  index={index}
                />
              );
            }
          })
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

import { useEffect, useRef, useCallback } from "react";
import { Messages, useMessages } from "../useMessages";
import { ActiveChat, useActiveChat } from "../useActiveChat";
import useSocketStore from "../useSocket";
import {
  GetMessagesResponse,
  MessageDeleteEmit,
  MessageEmit,
} from "@/api-types";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
export type InfiniteMessages = InfiniteData<AxiosResponse<GetMessagesResponse | undefined>>;

type Props = {
  attachListeners?: boolean;
  hasNewMessage?: () => void;
} | undefined
export function useChatBodyListeners(props: Props) {
  const { messages } = useMessages();
  const { activeChat } = useActiveChat();
  const { socket } = useSocketStore();
  const messagesRef = useRef<Messages>([]);
  const activeChatRef = useRef<ActiveChat | null>(null);
  const queryClient = useQueryClient();
  useEffect(() => {
    messagesRef.current = messages?.slice() ?? [];
  }, [messages]);

  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);
  const isActiveChat = useCallback((chatId: string) => {
    const isDmChat = activeChatRef.current?.dmInfo?.id === chatId;
    const isGroupChat = activeChatRef.current?.groupInfo?.id === chatId;
    return isDmChat || isGroupChat;
  }, []);
  const includeMessage = useCallback(
    (messageId: string, chatId: string, checkFound = true) => {
      let found;
      if (checkFound) {
        found = messagesRef.current?.find((item) => item.id === messageId);
      }
      if (!isActiveChat(chatId)) {
        return false;
      }
      if (checkFound && found) {
        return false;
      }
      return true;
    },
    []
  );

  const handleNewMessage = useCallback(
    (data: MessageEmit) => {
      console.log("handle new message: ", data);
      if (!includeMessage(data.message.id, data.chatInfo.id)) return;
      queryClient.setQueryData(
        ["messages", data.chatInfo.id],
        (oldData: InfiniteMessages) => {
          console.log("old data: ", oldData);
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }
          const newMessages = oldData.pages[0].data?.messages ?? [];
          return {
            pageParams: oldData.pageParams,
            pages: [
              ...oldData.pages.slice(1),
              {
                data: {
                  messages: [...newMessages, data.message],
                },
              },
            ],
          };
        }
      );
      if(props?.hasNewMessage){
       props.hasNewMessage();
      }
    },
    [includeMessage]
  );

  const handleUpdateMessage = useCallback(
    (data: MessageEmit) => {
      console.log("update message: ", data);
      if (!includeMessage(data.message.id, data.chatInfo.id, false)) return;
      queryClient.setQueryData(
        ["messages", data.chatInfo.id],
        (oldData: InfiniteMessages) => {
          console.log("old data: ", oldData);
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }
          const newData = oldData.pages.map((page) => {
            const messages = page.data?.messages.map((message) => {
              if (message.id === data.message.id) {
                return data.message;
              }
              return message;
            });
            return {
              data: {
                messages,
              },
            };
          });
          return {
            pageParams: oldData.pageParams,
            pages: newData,
          };
        }
      );
    },
    [includeMessage]
  );

  const handleDeleteMessage = useCallback(
    (data: MessageDeleteEmit) => {
      console.log("delete message: ", data);
      if (!includeMessage(data.deletedMessageId, data.chatId, false)) return;
      queryClient.setQueryData(
        ["messages", data.chatId],
        (oldData: InfiniteMessages) => {
          console.log("old data: ", oldData);
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }
          const newData = oldData.pages.map((page) => {
            const messages = page.data?.messages.filter(
              (message) => message.id !== data.deletedMessageId
            );
            return {
              data: {
                messages,
              },
            };
          });
          return {
            pageParams: oldData.pageParams,
            pages: newData,
          };
        }
      );
    },
    [includeMessage]
  );

  useEffect(() => {
    if (props?.attachListeners && socket) {
      socket.on("messageDeleted", handleDeleteMessage);
      socket.on("messageUpdated", handleUpdateMessage);
      socket.on("newMessage", handleNewMessage);

      return () => {
        socket.off("messageDeleted", handleDeleteMessage);
        socket.off("messageUpdated", handleUpdateMessage);
        socket.off("newMessage", handleNewMessage);
      };
    }
  }, [
    props?.attachListeners,
    socket,
    handleNewMessage,
    handleUpdateMessage,
    handleDeleteMessage,
  ]);
  return {
    isActiveChat,
    handleNewMessage,
    handleUpdateMessage,
    handleDeleteMessage,
  };
}

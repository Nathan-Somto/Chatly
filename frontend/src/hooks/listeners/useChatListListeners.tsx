import { MessageDeleteEmit, MessageEmit } from "@/api-types";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import useChatStore from "../useChats";
import { useActiveChat } from "../useActiveChat";
import { useProfileStore } from "../useProfile";
import { v4 } from "uuid";
import useSocketStore from "../useSocket";
import { ChatBoxType } from "@/components/chats";
import { InfiniteMessages, useChatBodyListeners } from "./useChatBodyListeners";
import { GetResponse } from "../query";
import { useNavigate } from "react-router-dom";
import { useMessages } from "../useMessages";
type ChatListResponse =
  | GetResponse<{
      chats: ChatBoxType[];
    }>
  | undefined;
export function useChatListListeners() {
  const navigate = useNavigate();
  const { socket } = useSocketStore();
  const { profile } = useProfileStore();
  const { activeChat, updateLastSeen, reset } = useActiveChat();
  const { removeChat } = useChatStore();
  const { setMessages } = useMessages();
  const queryClient = useQueryClient();
  const {
    handleDeleteMessage: onDeleteMsg,
    handleUpdateMessage: onUpdateMsg,
    handleNewMessage: onNewMsg,
    isActiveChat,
  } = useChatBodyListeners({
    attachListeners: false,
  });

  const handleNewMessage = useCallback(
    (data: MessageEmit) => {
      queryClient.setQueryData(["chats"], (oldChatList: ChatListResponse) => {
        console.log("handle new message: ", oldChatList?.data?.chats);
        const chatListCopy = oldChatList?.data?.chats?.slice() ?? [];
        const foundChatIndex = chatListCopy.findIndex(
          (chat) => chat.id === data.chatInfo.id
        );

        if (foundChatIndex !== -1) {
          const chat = chatListCopy[foundChatIndex];
          if (data.message.senderId === profile?.id) {
            data.chatInfo = { ...chat };
          } else if (activeChat?.dmInfo?.id === data.chatInfo.id) {
            updateLastSeen(new Date());
          }
          chatListCopy.splice(foundChatIndex, 1);
        }

        chatListCopy.unshift({
          message: {
            body: data.message.body,
            senderId: data.message.senderId,
            createdAt: data.message.createdAt,
            type: data.message.type,
            readByIds: data.message.readByIds,
            id: data.message.id,
          },
          ...data.chatInfo,
        });
        return {
          ...oldChatList,
          data: {
            chats: chatListCopy,
          },
        };
      });
      if (!isActiveChat(data.chatInfo.id)) {
        onNewMsg(data);
      }
    },
    [activeChat, profile, queryClient, updateLastSeen]
  );

  const handleChatLeave = useCallback(
    ({ chatId, userId }: { chatId: string; userId: string }) => {
      if (userId !== profile?.id) return;
      queryClient.setQueryData(["chats"], (oldChatList: ChatListResponse) => {
        const chatListCopy = oldChatList?.data?.chats?.filter(
          (chat) => chat.id !== chatId
        );
        return {
          ...oldChatList,
          data: {
            chats: chatListCopy,
          },
        };
      });
      queryClient.setQueryData(
        ["messages", chatId],
        (_OldMsgData: InfiniteMessages) => {
          return {
            pageParams: [],
            pages: [],
          };
        }
      );
      if (isActiveChat(chatId)) {
        reset();
        setMessages(null);
        navigate(`/${profile?.id}/chats`);
      }
    },
    [activeChat, queryClient, removeChat, reset, profile]
  );

  const handleUpdateMessage = useCallback(
    (data: MessageEmit) => {
      queryClient.setQueryData(["chats"], (oldChatList: ChatListResponse) => {
        const chatListCopy = oldChatList?.data?.chats?.slice() ?? [];
        const foundChatIndex = chatListCopy.findIndex(
          (chat) => chat.id === data.chatInfo.id
        );

        if (foundChatIndex !== -1) {
          const chat = chatListCopy[foundChatIndex];
          if (chat.message.id === data.message.id) {
            chatListCopy[foundChatIndex] = {
              ...chat,
              message: {
                body: data.message.body,
                senderId: data.message.senderId,
                createdAt: data.message.createdAt,
                type: data.message.type,
                readByIds: data.message.readByIds,
                id: data.message.id,
              },
            };

            if (data.message.senderId !== profile?.id && !chat.isGroup) {
              chatListCopy[foundChatIndex].lastSeen = new Date();
              if (activeChat.dmInfo?.id === data.chatInfo.id) {
                updateLastSeen(new Date());
              }
            }
          }
        }
        return {
          data: {
            chats: chatListCopy,
          },
        };
      });
      if (!isActiveChat(data.chatInfo.id)) {
        onUpdateMsg(data);
      }
    },
    [activeChat, profile, queryClient, updateLastSeen]
  );

  const handleMessageDelete = useCallback(
    ({ chatId, deletedMessageId, prevMessage, userId }: MessageDeleteEmit) => {
      queryClient.setQueryData(["chats"], (oldChatList: ChatListResponse) => {
        const chatListCopy = oldChatList?.data?.chats?.slice() ?? [];
        const foundChatIndex = chatListCopy.findIndex(
          (chat) => chat.id === chatId
        );
        if (foundChatIndex !== -1) {
          const chat = chatListCopy[foundChatIndex];
          if (chat.message.id === deletedMessageId) {
            chatListCopy[foundChatIndex] = {
              ...chat,
              message:
                prevMessage === null
                  ? {
                      body: null,
                      senderId: null,
                      createdAt: new Date(),
                      type: "TEXT",
                      readByIds: [],
                      id: v4(),
                    }
                  : {
                      body: prevMessage.body,
                      senderId: prevMessage.senderId,
                      createdAt: prevMessage.createdAt,
                      type: prevMessage.type,
                      readByIds: prevMessage.readByIds,
                      id: prevMessage.id,
                    },
            };
          }
        }
        return {
          data: {
            chats: chatListCopy,
          },
        };
      });
      if (!isActiveChat(chatId)) {
        onDeleteMsg({ chatId, deletedMessageId, prevMessage, userId });
      }
    },
    [queryClient]
  );

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", handleNewMessage);
      socket.on("leftChat", handleChatLeave);
      socket.on("messageUpdated", handleUpdateMessage);
      socket.on("messageDeleted", handleMessageDelete);

      return () => {
        socket.off("newMessage", handleNewMessage);
        socket.off("leftChat", handleChatLeave);
        socket.off("messageUpdated", handleUpdateMessage);
        socket.off("messageDeleted", handleMessageDelete);
      };
    }
  }, [
    socket,
    handleNewMessage,
    handleChatLeave,
    handleUpdateMessage,
    handleMessageDelete,
  ]);
}

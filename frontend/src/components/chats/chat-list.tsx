import { ChatBoxType } from ".";
import ChatBox from "./chat-box";
import ListContainer from "../common/list-container";
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { ErrorMessage } from "../common/error-message";
import P from "../ui/typo/P";
import { useEffect } from "react";
import useChatStore from "@/hooks/useChats";
import useSocketStore from "@/hooks/useSocket";
import { MessageEmit } from "@/api-types";
import { MoreHorizontalIcon } from "lucide-react";
import { useProfileStore } from "@/hooks/useProfile";
function ChatList() {
  const { profile } = useProfileStore();
  // fetch all the chats for the user
  const { chatList, setChatList } = useChatStore();
  const {
    data: response,
    isPending,
    refetch,
    isError,
  } = useGetQuery<{ chats: ChatBoxType[] }>({
    route: "/users/chats",
    enabled: true,
    queryKey: ["chats"],
  });
  const { socket } = useSocketStore();
  // have a listener attached to the socket.io to update the chatList
  useEffect(() => {
    // listen to the socket.io for new messages
    const handleNewMessage = (data: MessageEmit) => {
      // update the chatList
      const chatListCopy = chatList.slice();
      const foundChat = chatList.findIndex(
        (chat) => chat.id === data.chatInfo.id
      );
      if (foundChat !== -1) {
        chatListCopy[foundChat].message = data.message;
      } else {
        chatListCopy.unshift({
          id: data.chatInfo.id,
          isGroup: data.chatInfo.isGroup,
          name: data.chatInfo.name,
          message: data.message,
          avatars: data.chatInfo.avatars,
          lastSeen: data.chatInfo.lastSeen,
        });
      }
      setChatList(chatListCopy);
    }
    if(socket){
      socket.on("newMessage",handleNewMessage );
      return () => {
        socket.off("newMessage", handleNewMessage);
      }
    }
  }, [socket, chatList]);
  useEffect(() => {
    if (response) {
      console.log(response.data);
      setChatList(response.data.chats);
      // look for a smarter way of doing this
      response.data.chats.forEach((chat) => {
        socket?.emit("joinChat", { chatId: chat.id, userId: profile?.id });
      });
    }
  }, [response, socket]);
  if (isError) {
    <ErrorMessage title="Failed to complete Onboarding" refetch={refetch} />;
  }
  if (isPending) {
    return (
      <P className="text-center text-neutral-500 lg:h-[calc(100vh-16*0.25rem)] gap-x-1.5 flex items-center justify-center">
        Loading Chats{" "}
        <span>
          <MoreHorizontalIcon className="animate-bounce" />
        </span>
      </P>
    );
  }
  return (
    <ListContainer>
      {chatList.length === 0 ? (
        <P className="text-center text-lg h-[80%] flex items-center justify-center text-brand-p1 font-semibold mt-2">
          No Chats
        </P>
      ) : (
        chatList.map((item) => <ChatBox {...item} key={item.id} />)
      )}
    </ListContainer>
  );
}

export default ChatList;

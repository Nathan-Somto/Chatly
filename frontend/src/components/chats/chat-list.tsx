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
function ChatList() {
  // fetch all the chats for the user
  const { chatList,setChatList } = useChatStore();
  const {
    data: response,
    isPending,
    refetch,
    isError,
  } = useGetQuery<{chats:ChatBoxType[]}>({
    route: "/users/chats",
    enabled: true,
    queryKey: ["chats"],
  });
  const {socket} = useSocketStore();
  // have a listener attached to the socket.io to update the chatList
  useEffect(() => {
    // listen to the socket.io for new messages
    socket?.on("newMessage", (data: MessageEmit ) => {
      // update the chatList
      const chatListCopy = chatList.slice();
      const foundChat = chatList.findIndex( chat => chat.id === data.chatInfo.id);
      if(foundChat !== -1){
        chatListCopy[foundChat].message = data.message;
      }
      else {
        chatListCopy.unshift({
          id: data.chatInfo.id,
          isGroup: data.chatInfo.isGroup,
          name: data.chatInfo.name,
          message: data.message,
          avatars: data.chatInfo.avatars,
          lastSeen: data.chatInfo.lastSeen
        });
      }
      setChatList(chatListCopy);
    });
  }, [])
  useEffect(() => {
    if (response) {
      console.log(response.data);
     setChatList(response.data.chats);
    }
  }, [response]);
  if (isError) {
    <ErrorMessage title="Failed to complete Onboarding" refetch={refetch} />;
  }
  if (isPending) {
    return <P className="">Loading Chats...</P>;
  }
  return (
    <ListContainer>
      {chatList.length > 0 ? (
        <P className="text-center text-lg text-brand-p1 font-semibold mt-2">
          No Chats
        </P>
      ) : (
        chatList.map((item) => <ChatBox {...item} key={item.id} />)
      )}
    </ListContainer>
  );
}

export default ChatList;

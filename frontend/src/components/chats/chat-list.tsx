import { ChatBoxType } from ".";
import ChatBox from "./chat-box";
import ListContainer from "../common/list-container";
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { ErrorMessage } from "../common/error-message";
import P from "../ui/typo/P";
import { useEffect } from "react";
import useChatStore from "@/hooks/useChats";
import useSocketStore from "@/hooks/useSocket";
import { MoreHorizontalIcon } from "lucide-react";
import { useProfileStore } from "@/hooks/useProfile";
import { useChatListListeners } from "@/hooks/listeners";
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
useChatListListeners();
  useEffect(() => {
    if (response) {
      setChatList(
        response.data.chats.sort(
          (a, b) =>
            new Date(b.message.createdAt).getTime() -
            new Date(a.message.createdAt).getTime()
        )
      );
      // look for a smarter way of doing this
      response.data.chats.forEach((chat) => {
        socket?.emit("joinChat", { chatId: chat.id, userId: profile?.id });
      });
    }
  }, [response]);
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

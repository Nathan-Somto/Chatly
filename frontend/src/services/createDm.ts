import { CreateDmChatResponse, CreateDmPayload } from "@/api-types";
import { useMutate } from "@/hooks/query/useMutate";
import { useActiveChat } from "@/hooks/useActiveChat";
import useChatStore from "@/hooks/useChats";
import { useMessages } from "@/hooks/useMessages";
import { useProfileStore } from "@/hooks/useProfile";
import useSocketStore from "@/hooks/useSocket";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
type Props = {
  members: CreateDmPayload["members"];
  onComplete?: () => void;
};
// uses the useMutate hook to create a dm, there is no need to emit
export function CreateDm({ members, onComplete }: Props) {
  const { profile } = useProfileStore();
  const { setActiveChat } = useActiveChat();
  const { setMessages } = useMessages();
  const { chatList, setChatList } = useChatStore();
  const { socket } = useSocketStore();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutate({
    defaultMessage: "Failed to create dm!",
    method: "post",
    route: "/chats/create-dm",
    onSuccess(response) {
      const data: CreateDmChatResponse["privateChat"] = (
        response.data as CreateDmChatResponse
      )?.privateChat;
      console.log(data);
      const otherUser = data?.members.find(
        (member) => member.user.username !== profile?.username
      );
      const otherUserObj = {
        id: data?.id,
        avatarUrl: otherUser?.user?.avatar ?? "",
        username: otherUser?.user?.username ?? "",
        lastSeen: otherUser?.user?.lastSeen,
        bio: otherUser?.user?.bio,
        email: otherUser?.user?.email,
      };
      setActiveChat({
        groupInfo: null,
        dmInfo: otherUserObj,
      });
      // if the dm chat is not the chat list add it and emit the join chat
      const chatListCopy = chatList.slice();
      const chat = chatList.find((chat) => chat.id === data?.id);
      if (!chat) {
        chatListCopy.push({
          ...otherUserObj,
          name: otherUserObj.username,
          isGroup: false,
          message: {
            body: null,
            createdAt: new Date(),
            id: v4(),
            readByIds: [],
            senderId: profile?.id ?? "",
            type: "SYSTEM",
          },
        });
        setChatList(chatListCopy);
      }
      data.members.forEach((member) => {
        socket?.emit("joinChat", {
          chatId: data.id,
          userId: member.user.id,
        });
      });
      setMessages(null);
      navigate(`/${profile?.id}/chats/${response.data?.privateChat?.id}`);
    },
    onSettled() {
      onComplete && onComplete();
    },
  });
  async function handleCreate() {
    mutate({ members });
  }
  return {
    handleCreate,
    isPending,
  };
}

import { GroupChatResponse } from '@/api-types';
import { useMutate } from '@/hooks/query/useMutate';
import { useActiveChat } from "@/hooks/useActiveChat";
import { useMessages } from "@/hooks/useMessages";
import { useProfileStore } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import useSocket from '@/hooks/useSocket';
type Props = {
    chatId: string;
    onComplete?: () => void;
  };
function JoinGroupChat({chatId, onComplete}: Props) {
    const { profile } = useProfileStore();
    const { setActiveChat } = useActiveChat();
    const {setMessages} = useMessages();
    const navigate = useNavigate();
    const {socket} = useSocket()
    const { mutate, isPending } = useMutate({
        defaultMessage: "Failed to join group chat!",
        method: "post",
        route: `/chats/${chatId}/join`,
        onSuccess(response) {
          const groupChat: GroupChatResponse["groupChat"] = (
            response.data as GroupChatResponse
          )?.groupChat;
          console.log(groupChat)
         
          setActiveChat({
            groupInfo: {
                imageUrl: groupChat?.imageUrl,
                description: groupChat?.description,
                id: groupChat?.id,
                isGroup: true,
                members: groupChat?.members,
                name: groupChat?.name ?? ""
            },
            dmInfo: null,
          });
          socket?.emit("joinChat", {
            chatId: groupChat?.id,
            userId: profile?.id,
          });
          socket?.emit("newMessage", {
            message: response.data?.joinedMessage,
            chatInfo: groupChat,
          });
          setMessages([]);
          navigate(`/${profile?.id}/chats/${groupChat?.id}`);
        },
        onSettled() {
          onComplete && onComplete();
        },
      });
      async function handleJoin() {
        mutate({ userId: profile?.id, username: profile?.username });
      }
      return {
        handleJoin,
        isPending,
      };
}

export {JoinGroupChat}
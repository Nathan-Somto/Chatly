import { CreateDmChatResponse, CreateDmPayload } from "@/api-types";
import { useMutate } from "@/hooks/query/useMutate";
import { useActiveChat } from "@/hooks/useActiveChat";
import { useMessages } from "@/hooks/useMessages";
import { useProfileStore } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
type Props = {
  members: CreateDmPayload["members"];
  onComplete?: () => void;
};
// uses the useMutate hook to create a dm, there is no need to emit
export function CreateDm({ members, onComplete }: Props) {
  const { profile } = useProfileStore();
  const { setActiveChat } = useActiveChat();
  const {setMessages} = useMessages();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutate({
    defaultMessage: "Failed to create dm!",
    method: "post",
    route: "/chats/create-dm",
    onSuccess(response) {
      const data: CreateDmChatResponse["privateChat"] = (
        response.data as CreateDmChatResponse
      )?.privateChat;
      console.log(data)
      const otherUser = data?.members.find(
        (member) => member.user.username !== profile?.username
      );
      setActiveChat({
        groupInfo: null,
        dmInfo: {
          id: data?.id,
          avatar: otherUser?.user?.avatar ?? "",
          username: otherUser?.user?.username ?? "",
          lastSeen: otherUser?.user?.lastSeen,
        },
      });
      setMessages([]);
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

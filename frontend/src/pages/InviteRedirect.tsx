import { GroupChatResponse, JoinGroupChatPayload } from "@/api-types";
import LogoLoader from "@/components/common/logo-loader";
import { Button } from "@/components/ui/button";
import H1 from "@/components/ui/typo/H1";
import P from "@/components/ui/typo/P";
import { useMutate } from "@/hooks/query/useMutate";
import { useActiveChat } from "@/hooks/useActiveChat";
import { useProfileStore } from "@/hooks/useProfile";
import useSocketStore from "@/hooks/useSocket";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function InviteRedirect() {
  const { chatId, inviteCode } = useParams();
  const { profile } = useProfileStore();
  const messages = ["Joining Group Chat...", "Redirecting to Group Chat..."];
  const [index, setIndex] = useState(0);
  const { socket } = useSocketStore();
  const [notFoundError, setNotFoundError] = useState(false);
  const { setActiveChat } = useActiveChat();
  const navigate = useNavigate();
  const {
    isError,
    mutateAsync: JoinViaLink,
    isPending,
  } = useMutate<JoinGroupChatPayload>({
    method: "post",
    route: `/join-via-link`,
    displayToast: false,
    noToken: true,
  });
  const handleJoinViaLink = async () => {
    if (isPending) return;
    try {
      const response = await JoinViaLink({
        inviteCode: inviteCode ?? "",
        userId: profile?.id ?? "",
        chatId: chatId ?? "",
      });
      console.log("the response : ", response);
      const groupChat = response.data
        ?.groupChat as GroupChatResponse["groupChat"];
      const joinedMessage = response.data?.joinedMessage;
      if (!groupChat || !joinedMessage) {
        setNotFoundError(true);
        return;
      }
      socket?.emit("joinChat", { userId: profile?.id, chatId: groupChat?.id });
      socket?.emit("sendMessage", {
        chatInfo: groupChat,
        message: joinedMessage,
      });
      setActiveChat({
        dmInfo: null,
        groupInfo: {
          ...groupChat,
          name: groupChat?.name ?? null,
          isGroup: true,
        },
      });
      setIndex(1);
      setTimeout(() => {
        navigate(`/${profile?.id}/chats`);
      }, 1000);
    } catch (err) {
      if (err instanceof AxiosError && err?.response?.status === 404) {
        setNotFoundError(true);
      }
    }
  };
  useEffect(() => {
    if (!profile?.id || !chatId || !inviteCode) {
      setNotFoundError(true);
      return;
    }
    handleJoinViaLink();
  }, [chatId, inviteCode, profile?.id]);
  if (notFoundError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <H1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          404
        </H1>
        <P className="text-lg text-gray-600 dark:text-gray-400">
          Group Chat not found
        </P>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <H1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
          Failed to join Group Chat
        </H1>
        <Button
          onClick={() =>
            JoinViaLink({
              inviteCode: inviteCode ?? "",
              userId: profile?.id ?? "",
              chatId: chatId ?? "",
            })
          }
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }
  return (
    <div>
      <LogoLoader>
        <P className="text-lg text-gray-600 dark:text-gray-400">
          {messages[index]}
        </P>
      </LogoLoader>
    </div>
  );
}

export default InviteRedirect;

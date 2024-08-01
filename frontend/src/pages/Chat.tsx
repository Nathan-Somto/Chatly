import ChatBody from "@/components/chat/chat-body"
import ChatHeader from "@/components/chat/chat-header"
import MessageForm from "@/components/chat/message-form"
import { useActiveChat } from "@/hooks/useActiveChat"
import { useProfileStore } from "@/hooks/useProfile";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ChatPage() {
  const activeChat = useActiveChat((state) => state.activeChat);
  const navigate = useNavigate();
  const {profile} = useProfileStore();
  useEffect(() => {
    if(activeChat === null){
      navigate(`/${profile?.id}/chats`)
    }
  }, [activeChat]);
  return (
    <div>
      <ChatHeader/>
      <ChatBody/>
      <MessageForm/>
    </div>
  )
}

export default ChatPage
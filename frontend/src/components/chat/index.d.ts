type Message = {
    Sender: {
      username: string;
      avatar: string;
    };
    id: string;
    body: string | null;
    senderId: string;
    isEditted: boolean;
    readByIds: string[];
    resourceUrl: string | null;
    type: MessageType;
    createdAt: Date;
    chatId: string;
    parentMessage: {
      body: string;
      avatar: string;
      username: string;
    } | null;
    isReply: boolean;
  };
type ReplyTo =  {
  avatar: string;
  username: string;
  text: string;
  parentId: string;
}
type EditMessage =  {
  text: string;
  id: string;
  index: number;
}
type MemberRole = "OWNER" | "ADMIN" | "MEMBER";

type MessageType = "TEXT" | "AUDIO" | "IMAGE" | "VIDEO" | "SYSTEM";


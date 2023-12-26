type Message = {
  message: {
    Sender: {
      id: string;
      username: string;
      avatar: string;
      Member: {
        role: MemberRole;
      }[];
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
  };
};

type MemberRole = "OWNER" | "ADMIN" | "MEMBER";

type MessageType = "TEXT" | "AUDIO" | "IMAGE" | "VIDEO";

import { StrictAuthProp } from "@clerk/clerk-sdk-node";
import { $Enums } from "@prisma/client";

declare global {
  namespace Express {
    interface Request extends StrictAuthProp {}
  }
}
type MessageEmit = {
  message: {
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
    type: $Enums.MessageType;
    createdAt: Date;
    chatId: string;
    parentMessage: {
      body: string;
      avatar: string;
      username: string;
    } | null;
    isReply: boolean;
  };
  chatInfo: {
    id: string;
    isGroup: boolean;
    name: string | null;
    avatarUrl?: string | null;
    lastSeen?: Date;
    members?: string[];
    description?: string | null;
    email?: string | null;
    bio?: string | null;
    inviteCode?: string | null;
    privacy?: PrivacyType | null;
    imageUrl?: string | null;
  };
};
type MessageDeleteEmit = {
  chatId: string;
  deletedMessageId: string;
  prevMessage: MessageEmit['message'] | null;
  userId: string;
}
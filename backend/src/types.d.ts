import {StrictAuthProp} from '@clerk/clerk-sdk-node'
declare global {
    namespace Express {
      interface Request extends StrictAuthProp{}
    }
  }
type MessageEmit = {
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
    name: string;
    avatars: string[];
    lastSeen?: Date;
    description?: string | null;
  }
}
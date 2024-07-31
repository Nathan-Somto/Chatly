/** Response Types **/
export type GetUserResponse = {
  user: {
    id: string;
    username: string;
    email: string;
    clerkId: string;
    isOnboarded: boolean;
    avatar: string;
    bio: string;
  };
};
/** Ends Here **/

/** Socket IO types **/
export type MessageEmit = {
  message: Message["message"];
  chatInfo: {
    id: string;
    isGroup: boolean;
    name: string;
    avatars: string[];
    lastSeen?: Date;
  };
};
/** Ends Here **/

/** Payload types **/
export type CreateMessagePayload = {
  userId: string;
  body: string;
  chatId: string;
  type: MessageType;
  resourceUrl: string | null;
  parentMessageId: string | null;
};
export type EditMessagePayload = Pick<CreateMessagePayload, "body" | "chatId" | "userId"> 
/** Ends Here **/
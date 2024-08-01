/** Response Types **/
type PaginatedResponse<K extends string, T> = {
 [index in K]: T[];
} &
 {
 totalSize:number;
 page:number;
 pageSize:number;
}
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
export type GetMembersInfoResponse = {
  users: {
    id: string;
    username: string;
  }[]
};
export type GetMessagesResponse = PaginatedResponse<"messages", Message['message']>;
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
export type EditMessagePayload = Pick<CreateMessagePayload, "body" | "chatId" | "userId">;
export type CreateDmPayload = {
  members: {userId: string}[]
} 
/** Ends Here **/
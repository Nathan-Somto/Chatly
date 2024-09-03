type PrivacyType = "PUBLIC" | "PRIVATE";
type ChatBoxMessageType =  {
    id: string;
    createdAt: Date;
    body: string | null;
    type: MessageType;
    readByIds: string[];
    senderId: string | null;
}
type ChatBoxType = 
    {
        id: string;
        isGroup: boolean;
        name: string | null;
        message: ChatBoxMessageType;
        lastSeen?: Date;
        members?:string[];
        description?:string | null;
        email?:string | null;
        bio?:string | null;
        inviteCode?: string | null;
        privacy?: PrivacyType | null;
        avatarUrl: string; // for the other user
        imageUrl?: string | null; // for the group chat
    }
type SearchDataType = (UserBox | (GroupBox & {isGroup: boolean}))[]
export{type ChatBoxType, PrivacyType, SearchDataType, ChatBoxMessageType}
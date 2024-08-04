type ChatBoxType = 
    {
        id: string;
        isGroup: boolean;
        name: string | null;
        message: {
            createdAt: Date;
            body: string | null;
            type: MessageType;
            readByIds: string[];
        };
        avatars: string[];
        lastSeen?: Date;
        members?:string[];
        description?:string | null;
        email?:string | null;
        bio?:string | null;
        inviteCode?: string | null;
    }
export {type ChatBoxType}
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
    }
export {type ChatBoxType}
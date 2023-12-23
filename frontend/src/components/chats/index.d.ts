type ChatBoxType = {
    name: string;
    id: string;
    isGroup: boolean;
    members:{
        user: {
            username: string;
            avatar: string;
        }
    }[],
    message: {
        createdAt: Date;
        body: string | null;
        readBy: {
            userId: string;
        }[];
    }
}
export {type ChatBoxType}
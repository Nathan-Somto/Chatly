import { $Enums } from "@prisma/client";
interface GroupChat {
    id: string;
    name: string | null;
    inviteCode: string | null;
    description: string | null;
    privacy: $Enums.PrivacyType | null;
    imageUrl: string | null;
}
interface GroupChatResponse extends GroupChat {
    avatars: string[];
    members: string[];
}
interface GroupChatPayload extends GroupChat {
    members: {
        user: {
            username: string;
            avatar: string;
        };
    }[];
}
export function formatGroupchatResponse(groupChat: GroupChatPayload): GroupChatResponse {
    return {
        avatars: groupChat.members.map((member) => member.user.avatar),
        members: groupChat.members.map((member) => member.user.username),
        id: groupChat.id,
        name: groupChat?.name ?? null,
        inviteCode: groupChat?.inviteCode ?? null,
        description: groupChat?.description ?? null,
        privacy: groupChat.privacy,
        imageUrl: groupChat?.imageUrl ?? null
    }
}
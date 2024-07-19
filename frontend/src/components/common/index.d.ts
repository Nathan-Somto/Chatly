type Role = "OWNER" | "ADMIN" | "MEMBER";
type UserBox = {
    id: string; //@Description: user id to check if there is converation on the backend
    username: string;
    lastSeen: Date;
    avatar: string;
    role?: Role;
}
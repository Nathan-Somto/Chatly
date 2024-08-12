type Role = "OWNER" | "ADMIN" | "MEMBER";
interface UserBox {
    id: string; //@Description: user id to check if there is converation on the backend
    username: string;
    lastSeen: Date;
    avatar: string;
    role?: Role;
}
interface GroupBox {
  id: string;
  chatId:string;
  avatars: string[];
  name: string;
  description: string;
  isGroup: boolean;
}
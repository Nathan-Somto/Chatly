import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "@/hooks/useProfile";
import { Button } from "../ui/button";
import AvatarUser from "./avatar-user";
import { LogOutIcon, MessageCircleIcon } from "lucide-react";

const ProfileButton = () => {
  const { profile } = useProfileStore();
  const navigate = useNavigate();

  if (!profile) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <AvatarUser src={profile.avatar} alt={profile.username} size={40} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] -bottom-20 p-4 mr-10 max-w-none z-[1000000]">
        <div className="flex items-center space-x-4 mb-2 py-2">
          <div className="flex-shrink-0">
            <AvatarUser src={profile.avatar} alt={profile.username} size={64} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium truncate">{profile.username}</span>
            <span className="text-sm text-gray-500 truncate">
              {profile.email}
            </span>
          </div>
        </div>
        <DropdownMenuItem
          onClick={() => navigate(`/${profile.id}/chats`)}
          className="gap-x-1.5 cursor-pointer mb-1.5"
        >
          <MessageCircleIcon />
          View Chats
        </DropdownMenuItem>
        {/* Sign out with text destructive */}
        <DropdownMenuItem
          onClick={() => navigate("/signout")}
          className="text-destructive text-sm gap-x-1.5 cursor-pointer"
        >
          <LogOutIcon />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileButton;

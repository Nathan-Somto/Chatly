import { Avatar } from "@/components/common/avatar";
import { Button } from "@/components/ui/button";
import H3 from "@/components/ui/typo/H3";
import P from "@/components/ui/typo/P";
import { useActiveChat } from "@/hooks/useActiveChat";
import { useProfileStore } from "@/hooks/useProfile";
import { cn, formatLastSeen } from "@/lib/utils";
import { SlashIcon, Trash2Icon, VideoIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
type Props = {
  id: string;
  username: string;
  bio: string;
  lastSeen: Date;
  avatar: string | null;
  email: string;
  closeDrawer: () => void;
};
export default function DmContents({
  avatar,
  email,
  username,
  lastSeen,
  bio,
}: Props) {
  const { profile } = useProfileStore();
  const { dmInfo } = useActiveChat((state) => state.activeChat);
  const navigate = useNavigate();
  const { lastSeen: formattedLastSeen, isOnline } = formatLastSeen(
    lastSeen ?? new Date()
  );
  return (
    <div>
      <header className="border-b mb-5 mt-6 pb-3">
        <div className=" flex items-center gap-x-5 justify-start">
          <Avatar
            type="User"
            src={avatar}
            size={96}
            alt={`${username ?? 'User'}'s avatar`}
          />
          <div>
            <H3>{username}</H3>
            <P
              className={cn(
                "text-sm font-light opacity-80",
                isOnline && "text-brand-p1 opacity-100 dark:text-brand-p2"
              )}
            >
              {formattedLastSeen}
            </P>
          </div>
        </div>
        <div className="my-4">
          <H3 className="text-[15px] text-neutral-600 ">Email</H3>
          <a href={`mailto:${email}`} className="underline text-brand-p2">
            {email}
          </a>
        </div>
        <div>
          <H3 className="text-[15px] text-neutral-600 ">Bio</H3>
          <P>{bio}</P>
        </div>
      </header>
      <section>
        <Button variant={"outline"} className="w-full justify-start mt-3">
          {" "}
          <SlashIcon className="mr-2" />
          Block user
        </Button>
        <Button
          onClick={() => navigate(`/${profile?.id}/chats/${dmInfo?.id}/video-chat`)}
          variant={"outline"}
          className="w-full justify-start mt-3"
        >
          {" "}
          <VideoIcon className="mr-2" />
          Video Chat
        </Button>
        <Button
          variant={"outline"}
          className="text-destructive w-full justify-start mt-3"
        >
          <Trash2Icon className="mr-2" />
          Delete Chat
        </Button>
      </section>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import P from "../ui/typo/P";
import H2 from "../ui/typo/H2";
import { Button } from "../ui/button";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import AvatarGroup from "../common/avatar-group";
import { useActiveChat } from "@/hooks/useActiveChat";
import { useMemo, useState } from "react";
import { cn, formatLastSeen } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ProfileDrawer from "../drawers/profileDrawer/profile-drawer";
import { useProfileStore } from "@/hooks/useProfile";

function ChatHeader() {
  const [openDrawer, setOpenDrawer] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const activeChat = useActiveChat((state) => state.activeChat);
  const {profile} = useProfileStore();
  console.log(activeChat);
  const members = useMemo(() => {
    return (
      activeChat?.groupInfo?.members ?? []
    );
  }, [activeChat]);
  const { lastSeen, isOnline } = useMemo(
    () => formatLastSeen(activeChat?.dmInfo?.lastSeen ?? new Date()),
    [activeChat]
  );
  const navigate = useNavigate();
  function handleDrawerOpen() {
    setOpenDrawer(true);
  }
  return (
    <>
      <ProfileDrawer openDrawer={setOpenDrawer} isOpen={openDrawer} />
      <header className="flex h-[75px] items-center justify-between px-4 py-5 bg-white dark:bg-[#17191C] w-full lg:w-[calc(100%-350px)]  fixed top-0 z-[50] border-b">
        <Button
          variant={"ghost"}
          className="lg:hidden"
          size="icon"
          onClick={() => navigate(`/${profile?.id}/chats`)}
        >
          <ChevronLeft />
        </Button>
        <div className="flex max-lg:w-[80%] max-lg:flex-shrink-0 flex-row-reverse lg:gap-5 justify-between  lg:items-center lg:flex-row">
          <figure
            onClick={isMobile ? handleDrawerOpen : void 0}
            className="h-12 max-lg:hover:opacity-70 max-lg:cursor-pointer w-12 max-lg:text-center  text-slate-500 flex  items-center justify-center  "
          >
            {activeChat?.groupInfo?.isGroup ? (
              <AvatarGroup  avatars={activeChat?.groupInfo?.avatars ?? []} />
            ) : (
              <img
                src={activeChat?.dmInfo?.avatar ?? ""}
                alt="other user avatar"
                className="h-full w-full rounded-full"
              />
            )}
          </figure>
          <div className="text-center lg:text-left max-lg:w-[calc(80%-12*0.25rem)] max-lg:flex-shrink-0">
            <H2 className="text-xl truncate">
              {activeChat?.groupInfo?.isGroup
                ? activeChat?.groupInfo?.name
                : activeChat?.dmInfo?.username}
            </H2>
            <P
              className={cn(
                "text-sm font-light",
                isOnline &&
                  !activeChat?.groupInfo?.isGroup &&
                  "text-brand-p1 dark:text-brand-p2"
              )}
            >
              {activeChat?.groupInfo?.isGroup
                ? members.join(", ") + "..."
                : lastSeen}
            </P>
          </div>
        </div>
        <Button
          variant={"ghost"}
          className=" hidden lg:block text-brand-p2 hover:bg-transparent !p-0"
          size="icon"
          onClick={handleDrawerOpen}
        >
          <MoreHorizontal size={25} />
          <span className="sr-only">Chat menu</span>
        </Button>
      </header>
    </>
  );
}

export default ChatHeader;

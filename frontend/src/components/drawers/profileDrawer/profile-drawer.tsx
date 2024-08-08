import { SheetContent, Sheet } from "@/components/ui/sheet";
import { useActiveChat } from "@/hooks/useActiveChat";
import GroupChatContents from "./groupchat-contents";
import DmContents from "./dm-contents";
import P from "@/components/ui/typo/P";
import { cn } from "@/lib/utils";
function ProfileDrawer({ isOpen, openDrawer }: DrawerProps) {
  const { activeChat } = useActiveChat();
  function closeDrawer() {
    openDrawer(false);
  }
  return (
    <Sheet open={isOpen} onOpenChange={(open) => openDrawer(open)}>
      <SheetContent
        side={"right"}
        className={cn(
          "overflow-y-auto w-full",
          activeChat?.groupInfo && "sm:!w-[500px] !max-w-[500px]"
        )}
      >
        {activeChat?.groupInfo ? (
          <GroupChatContents
            name={activeChat.groupInfo?.name ?? "No name"}
            description={activeChat.groupInfo?.description ?? "No description"}
            avatars={activeChat.groupInfo.avatars}
            privacyType={activeChat.groupInfo?.privacy ?? void 0}
            inviteCode={activeChat.groupInfo?.inviteCode ?? "No invite code"}
            closeDrawer={closeDrawer}
          />
        ) : activeChat?.dmInfo ? (
          <DmContents
            username={activeChat.dmInfo.username}
            avatar={activeChat.dmInfo.avatar}
            lastSeen={activeChat.dmInfo?.lastSeen ?? new Date()}
            bio={activeChat.dmInfo?.bio ?? "No bio"}
            email={activeChat.dmInfo?.email ?? "No email"}
            id={activeChat.dmInfo.id}
            closeDrawer={closeDrawer}
          />
        ) : (
          <P>Nothing to show here!</P>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default ProfileDrawer;

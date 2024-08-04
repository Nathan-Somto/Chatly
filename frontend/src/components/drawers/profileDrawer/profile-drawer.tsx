import { SheetContent, Sheet } from "@/components/ui/sheet";
import { useActiveChat } from "@/hooks/useActiveChat";
import GroupChatContents from "./groupchat-contents";
import { sampleUserBoxData } from "@/components/common/user-group-box";
import { v4 as uuidv4 } from "uuid";
import DmContents from "./dm-contents";
import P from "@/components/ui/typo/P";
function ProfileDrawer({ isOpen, openDrawer }: DrawerProps) {
  const { activeChat } = useActiveChat();
  // perform some data fetching later!
  return (
    <Sheet open={isOpen} onOpenChange={(open) => openDrawer(open)}>
      <SheetContent side={"right"} className="overflow-y-auto">
        {activeChat?.groupInfo ? (
          <GroupChatContents
            name={activeChat.groupInfo.name}
            description={activeChat.groupInfo?.description ?? "No description"}
            avatars={activeChat.groupInfo.avatars}
            memberCount={sampleUserBoxData.length}
            privacyType="PUBLIC"
            canEdit
            inviteCode={uuidv4()}
            isOwner={false}
            users={sampleUserBoxData}
          />
        ) : activeChat?.dmInfo ? (
          <DmContents
            username={activeChat.dmInfo.username}
            avatar={activeChat.dmInfo.avatar}
            lastSeen={activeChat.dmInfo?.lastSeen ?? new Date()}
            bio={activeChat.dmInfo?.bio ?? "No bio"}
            email={activeChat.dmInfo?.email ?? "No email"}
            id={activeChat.dmInfo.id}
          />
        ) : (
          <P>Nothing to show here!</P>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default ProfileDrawer;

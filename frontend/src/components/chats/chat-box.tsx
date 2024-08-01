import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { ChatBoxType } from ".";
import { useMemo } from "react";
import AvatarGroup from "../common/avatar-group";
import { useActiveChat } from "@/hooks/useActiveChat";
import AvatarUser from "../common/avatar-user";
import { useProfileStore } from "@/hooks/useProfile";
type Props = ChatBoxType;
function ChatBox({
  id,
  isGroup,
  name,
  message: { body, createdAt, readByIds: readBy },
  avatars,
  lastSeen,
  members
}: Props) {
  const setActiveChat = useActiveChat((state) => state.setActiveChat);
  const { pathname } = useLocation();
  const navigate = useNavigate();
 const {profile} = useProfileStore();

  const selected = pathname.includes(id);
  function handleClick() {
    const dmInfo = isGroup
      ? null
      : {
          avatar: avatars[0],
          username: name ?? "Chatly User",
          id,
          lastSeen: lastSeen,
        };
    const groupInfo = isGroup
      ? {
          id,
          isGroup: true,
          name: name ?? 'Group Chat',
          avatars,
          members
        }
      : null;
    setActiveChat({
      dmInfo,
      groupInfo,
    });
    navigate(`/${profile?.id}/chats/${id}`);
  }
  const hasSeen = useMemo(() => {
    return readBy.some((value) => value === profile?.id);
  }, [readBy]);
  return (
    <div
      onClick={handleClick}
      className={cn(
        `
            w-full 
            relative 
            flex 
            items-center 
            space-x-3 
            py-3 
            px-1
            hover:bg-neutral-200
            dark:hover:bg-[#272A20]
            rounded-lg
            transition
            cursor-pointer
            `,
        selected ? "bg-neutral-200 dark:bg-[#272A20]" : ""
      )}
    >
      {isGroup ? (
        <AvatarGroup avatars={avatars} />
      ) : (
        <AvatarUser
        src={avatars?.length > 0 ? avatars[0] : null}
         alt="user's avatar"
         size={48}
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex justify-between items-center mb-1">
            <p className="text-md font-medium text-gray-900 truncate dark:text-gray-100">
              { name }
            </p>
            {createdAt && (
              <p
                className="
                      text-xs 
                      text-gray-400 
                      font-light
                    "
              >
                {new Date(createdAt).toLocaleTimeString()}
              </p>
            )}
          </div>
          <p
            className={cn(
              `
                  truncate 
                  text-sm
                  `,
              hasSeen
                ? "text-gray-500"
                : "text-black font-medium dark:text-gray-400"
            )}
          >
            {body}
          </p>
        </div>
      </div>
    </div>
  );
}
export default ChatBox;

import { article, cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { ChatBoxType } from ".";
import { useMemo } from "react";
import AvatarGroup from "../common/avatar-group";
import { useActiveChat } from "@/hooks/useActiveChat";
import AvatarUser from "../common/avatar-user";
import { useProfileStore } from "@/hooks/useProfile";
import { CheckCheckIcon, CheckIcon } from "lucide-react";

type Props = ChatBoxType;

function ChatBox({
  id,
  isGroup,
  name,
  message: { body, createdAt, readByIds: readBy, type, senderId },
  avatars,
  lastSeen,
  members,
  bio,
  email,
  description,
  inviteCode,
  privacy,
}: Props) {
  const setActiveChat = useActiveChat((state) => state.setActiveChat);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { profile } = useProfileStore();
  const showReadTick = senderId === profile?.id;
  const selected = pathname.includes(id);

  function handleClick() {
    const dmInfo = isGroup
      ? null
      : {
          avatar: avatars[0],
          username: name ?? "Chatly User",
          id,
          lastSeen: lastSeen,
          email,
          bio,
        };
    const groupInfo = isGroup
      ? {
          id,
          isGroup: true,
          name: name ?? "Group Chat",
          avatars,
          members,
          description: description ?? "No Description",
          inviteCode: inviteCode ?? null,
          privacy,
        }
      : null;
    setActiveChat({
      dmInfo,
      groupInfo,
    });
    navigate(`/${profile?.id}/chats/${id}`);
  }
  const hasSeen = useMemo(() => {
    return readBy.length > 0;
  }, [readBy]);

  const lowercaseType = type.toLowerCase();

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
            <p className="text-[15px] font-medium text-gray-900 truncate dark:text-gray-100">
              {name}
            </p>
            <div className="flex items-center gap-x-1.5">
              {/* Read Tick */}
              {showReadTick && (
                <span className="ml-2 flex">
                  {!hasSeen ? (
                    <CheckIcon className="w-4 h-4 text-brand-p1 opacity-80" />
                  ) : (
                    <CheckCheckIcon className="w-4 h-4 text-brand-p1" />
                  )}
                </span>
              )}
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
          </div>
          <div className="flex items-center">
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
              {type === "TEXT" || type === 'SYSTEM'
                ? body === null
                  ? "start a conversation!"
                  : body
                : `sent ${article(lowercaseType)} ${lowercaseType}!`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;

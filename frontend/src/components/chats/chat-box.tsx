import { cn } from '@/lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChatBoxType } from '.';
import { useMemo } from 'react';
import AvatarGroup from './avatar-group';
import { ActiveChat, useActiveChat } from '@/hooks/useActiveChat';
type Props = ChatBoxType;
function ChatBox({
    id,
    isGroup,
    name,
    message: {body, createdAt, readBy},
    members

}: Props) {
    const setActiveChat = useActiveChat((state) => state.setActiveChat)
    const {pathname} = useLocation();
    const navigate = useNavigate();
    const user = {
        id: "123456"
    }

    const selected = pathname.includes(id);
    function handleClick(){
      const dmInfo = isGroup ? null : {
        avatar: members[0].user.avatar,
        username: members[0].user.username,
        id: members[0].user.id,
        lastSeen: members[0].user.lastSeen, 
      }
      const groupInfo = isGroup ? null : {
        id,
        isGroup: true,
        members,
        name
      } 
        setActiveChat({
          dmInfo,
          groupInfo,
          messages: []
        })
        navigate(`/${user.id}/chats/${id}`)
    }
    const hasSeen = useMemo(() => {
        return readBy.some((value) => value.userId === user.id )
    }, [readBy]);
    return ( 
        <div
          onClick={handleClick}
          className={cn(`
            w-full 
            relative 
            flex 
            items-center 
            space-x-3 
            py-3 
            px-1
            hover:bg-neutral-100
            dark:hover:bg-gray-700
            rounded-lg
            transition
            cursor-pointer
            `,
            selected ? 'bg-neutral-100 dark:bg-gray-700' : 'bg-white dark:bg-background'
          )}
        >
          {isGroup ? <AvatarGroup
            members={members}
          /> : (
            <img src={members[0]?.user?.avatar} alt="user's avatar" className="rounded-full h-12 w-12 object-cover"/>
          )}
          <div className="min-w-0 flex-1">
            <div className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <div className="flex justify-between items-center mb-1">
                <p className="text-md font-medium text-gray-900 truncate dark:text-gray-100">
                  {isGroup ? name : members[0]?.user?.username}
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
                className={cn(`
                  truncate 
                  text-sm
                  `,
                  hasSeen ? 'text-gray-500' : 'text-black font-medium dark:text-gray-400'
                )}>
                  {body}
                </p>
            </div>
          </div>
        </div>
      );
    }
export default ChatBox
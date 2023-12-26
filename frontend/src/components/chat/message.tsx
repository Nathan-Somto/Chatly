import { cn } from "@/lib/utils";
import React from "react";
import P from "../ui/typo/P";
import { CheckCheckIcon, CheckIcon, MoreHorizontalIcon } from "lucide-react";

type Props = Message & {
  openModal: (src: string) => void;
  sending?:boolean;
  failed?:boolean;
};
function Message({
  message: {
    Sender: { Member, avatar, username },
    body,
    createdAt,
    isEditted,
    readByIds,
    id,
    resourceUrl,
    type,
    senderId,
  },
  openModal,
  sending
}: Props) {
  const user = {
    id: "user1",
  };
  const isOwn = user.id === senderId;
  const isRead = readByIds.length > 0;
  return (
    <article className={cn("flex gap-3 p-4   w-full items-center", isOwn && "justify-end")}>
        
     {!isOwn &&(
        <figure className={cn('rounded-full self-end h-10 w-10 flex-shrink-0 overflow-hidden',isOwn && "order-2")}>
        <img src={avatar} alt={username + " avatar"} loading='lazy' className="h-full w-full object-center object-cover"/>
      </figure>
     )} 
      <div className="space-y-1">
      <div>
        {resourceUrl !== null ? (
          <div role="button" onClick={() => openModal(resourceUrl)} className={cn("p-2 rounded-t-lg   h-[300px]  w-full bg-gray-300 dark:bg-gray-700", isOwn && "")}>
            {type === "IMAGE" ? (
              <figure className="h-[295px] w-full overflow-hidden rounded-lg">
                <img src={resourceUrl} alt="message image" loading="lazy" className="object-cover hover:scale-110  object-center h-full hover:opacity-90 transition-all ease-in duration-200 w-full" />
              </figure>
            ) : type === "VIDEO" ? (
              <video src={resourceUrl} playsInline loop></video>
            ) : null}
          </div>
        ) : null}
        {body && (
          <div
            className={cn(
              `
             w-full
             overflow-hidden 
             bg-gray-300 
             dark:bg-gray-700 
             text-gray-800 
             dark:text-gray-100
             rounded-bl-lg
            rounded-br-2xl
             rounded-tr-2xl
             rounded-tl-2xl
             
             p-3
             `,
              isOwn &&
                `
                rounded-bl-2xl
                rounded-br-lg
              bg-brand-p1 dark:bg-[rgb(60,116,161)] text-gray-200 dark:text-gray-50
             `,
             resourceUrl && "!rounded-t-none"
            )}
          >
            {!isOwn && (<P className="mb-[0.3rem] text-sm font-medium text-gray-900 dark:text-gray-200">{username}</P>) }
            <P className="">{body}</P>
            {isEditted && <P className="opacity-80 text-xs">editted</P>}
            {isOwn ? (<div className="flex justify-end items-center">
                {isRead ? (<CheckCheckIcon size={14}/>) : (<CheckIcon size={14}/>)}
            </div>) : null}
          </div>
        )}
        </div>
        {/* Message Footer */}
        <div className="flex items-center gap-2">
         <P className="font-light text-sm">{createdAt.toLocaleDateString()}</P>
       {sending &&( <P><span>Sending</span> <span ><MoreHorizontalIcon className="animate-bounce"/></span></P>)}
        </div>
      </div>
    </article>
  );
}

export default Message;

import { cn } from "@/lib/utils";
import P from "../ui/typo/P";
import {
  AlertCircleIcon,
  CheckCheckIcon,
  CheckIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import MessageOptions from "./message-options";

type Props = Message & {
  openModal: (src: string) => void;
  sending?: boolean;
  failed?: boolean;
  index: number;
};
import LinkifiedText from "./linkifiedText";
import { useProfileStore } from "@/hooks/useProfile";
import ProfileBox from "./profile-box";

function Message({
  message: {
    Sender: { avatar, username, id: senderId },
    body,
    createdAt,
    isEditted,
    readByIds,
    id,
    resourceUrl,
    type,
    isReply,
    parentMessage,
  },
  openModal,
  sending,
  failed,
  index,
}: Props) {
  const { profile } = useProfileStore();
  const isOwn = profile?.id === senderId;
  const isRead = readByIds.length > 0;
  return (
    <>
      <MessageOptions
        isOwn={isOwn}
        id={id}
        disabled={!!(sending || failed)}
        replyTo={{
          parentId: id,
          text: body ?? "",
          avatar,
          username,
        }}
        bodyText={body ?? void 0}
        editMessage={{
          id,
          index,
          text: body ?? "",
        }}
        index={index}
      >
        <article
          className={cn(
            "flex gap-3 p-4 w-full  items-center",
            isOwn && "justify-end"
          )}
          id={id}
        >
          {!isOwn && (
            <ProfileBox avatar={avatar} username={username} id={senderId}>
              <figure
                className={cn(
                  "rounded-full self-end h-10 w-10 flex-shrink-0 overflow-hidden",
                  isOwn && "order-2"
                )}
              >
                <img
                  src={avatar}
                  alt={username + " avatar"}
                  loading="lazy"
                  className="h-full w-full object-center object-cover"
                />
              </figure>
            </ProfileBox>
          )}
          <div className="">
            <div
              className={cn(
                "max-w-full overflow-hidden space-y-1 bg-gray-300 dark:bg-[#17191c] text-gray-800 dark:text-gray-100 rounded-bl-lg rounded-br-2xl rounded-tr-2xl rounded-tl-2xl group p-3",
                isOwn &&
                  "rounded-bl-2xl rounded-br-lg bg-brand-p1 dark:bg-[rgb(60,116,161)] text-gray-200 dark:text-gray-50",
                resourceUrl && ""
              )}
            >
              {/* Parent Message */}
              {isReply && (
                <div className="flex gap-x-1.5">
                  <div
                    className={cn(
                      "dark:bg-gray-800 bg-gray-50 rounded-tr-lg rounded-tl-lg rounded-bl-lg rounded-br-sm py-3 px-1.5",
                      isOwn && "bg-[rgb(84,157,216)] dark:bg-[rgb(48,94,131)]"
                    )}
                  >
                    <p className="font-light">{parentMessage?.body}</p>
                  </div>
                  <figure
                    className={cn(
                      "rounded-full self-end h-8 w-8 flex-shrink-0 overflow-hidden"
                    )}
                  >
                    <img
                      src={parentMessage?.avatar}
                      alt={"reply message avatar"}
                      loading="lazy"
                      className="h-full w-full object-center object-cover"
                    />
                  </figure>
                </div>
              )}
              <div>
                {resourceUrl !== null ? (
                  <div
                    role="button"
                    onClick={(e) => {
                      console.log("clicked");
                      e.stopPropagation();
                      e.preventDefault();
                      openModal(resourceUrl);
                    }}
                    className={cn(
                      "p-2 rounded-t-lg mb-3 h-[300px] w-full bg-gray-300 dark:bg-[#17191c]",
                      isOwn && ""
                    )}
                  >
                    {type === "IMAGE" ? (
                      <figure className="h-[295px] w-full overflow-hidden rounded-lg">
                        <img
                          src={resourceUrl}
                          alt="message image"
                          loading="lazy"
                          className="object-cover hover:scale-110 object-center h-full hover:opacity-90 transition-all ease-in duration-200 w-full"
                        />
                      </figure>
                    ) : type === "VIDEO" ? (
                      <video src={resourceUrl} playsInline loop></video>
                    ) : null}
                  </div>
                ) : null}
                {body && (
                  <div>
                    {!isOwn && (
                      <P className="mb-[0.3rem] text-sm font-medium max-w-fit text-gray-900 dark:text-gray-200">
                        {username}
                      </P>
                    )}
                    <P className="">
                      <LinkifiedText text={body} isOwn={isOwn} />
                    </P>
                    {isEditted && <P className="opacity-80 text-xs">edited</P>}
                    {sending ? (
                      <P className="flex items-center gap-2 opacity-70 text-sm">
                        <span>Sending</span>{" "}
                        <span>
                          <MoreHorizontalIcon className="animate-bounce" size={14} />
                        </span>
                      </P>
                    ) : failed ? (
                      <P className="flex items-center justify-end gap-2 dark:text-rose-300  text-red-900 text-sm">
                        <span>Failed</span>{" "}
                        <span>
                          <AlertCircleIcon size={14} />
                        </span>
                      </P>
                    ) : isOwn ? (
                      <div className="flex justify-end items-center">
                        {isRead ? (
                          <CheckCheckIcon size={14} />
                        ) : (
                          <CheckIcon size={14} />
                        )}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
            {/* Message Footer */}
            <div className="flex items-center gap-2">
              <P className="font-light text-sm">
                {new Date(createdAt)?.toLocaleDateString()}
              </P>
            </div>
          </div>
        </article>
      </MessageOptions>
    </>
  );
}

export default Message;

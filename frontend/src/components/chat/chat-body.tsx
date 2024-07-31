import { DarkWall, LightWall } from "@/assets";
import { useTheme } from "../wrappers/theme-provider";
import { MessageSquareIcon } from "lucide-react";
import P from "../ui/typo/P";
import { useMessages } from "@/hooks/useMessages";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef, useState } from "react";
import MediaViewModal from "../modals/media-viewer-modal";
import DeleteMessageModal from "../modals/delete-message-modal";
import useSocketStore from "@/hooks/useSocket";
import { MessageEmit } from "@/api-types";
import Message from "./message";

function ChatBody() {
  const [openImgModal, setOpenImgModal] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const { theme } = useTheme();
  const {messages, addMessage} = useMessages();
  const {socket} = useSocketStore();
  const bodyRef = useRef<HTMLElement>(null);
  function openImageModal(src: string) {
    setOpenImgModal(true);
    setImgSrc(src);
  }
  // attach a socket io listener for new messages
  useEffect(() => {
    socket?.on("newMessage", (data: MessageEmit) => {
      // update the messages state
      addMessage(data.message);
    })
  }, [socket])
  // on new messages scroll to the bottom of the page if the user is not there
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTo({
        top: bodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <>
      <section
        style={{
          backgroundImage: `url(${theme === "dark" ? DarkWall : LightWall})`,
          backgroundRepeat: "repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        ref={bodyRef}
        className="mt-[75px] min-h-screen mb-16 relative"
      >
        {messages.length == 0 ? (
          <div className="h-screen grid place-items-center content-center">
            <figure className="mb-5">
              <MessageSquareIcon
                className="text-gray-800 dark:text-gray-50 rotate-[360deg]"
                size={96}
              />
            </figure>
            <P className="font-medium opacity-90 text-gray-800 dark:text-gray-50">
              No messages here yet...
            </P>
          </div>
        ) : (
          messages.map((item, index) => (
            <Message
              message={item}
              sending={item?.sending}
              openModal={openImageModal}
              key={uuidv4()}
              index={index}
            />
          ))
        )}
      </section>
      <MediaViewModal
        src={imgSrc}
        open={openImgModal}
        setOpen={setOpenImgModal}
      />
      <DeleteMessageModal
      />
    </>
  );
}

export default ChatBody;

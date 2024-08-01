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
import { GetMessagesResponse, MessageEmit } from "@/api-types";
import Message from "./message";
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { useParams } from "react-router-dom";
import { useProfileStore } from "@/hooks/useProfile";
import Loader from "../ui/loader";

function ChatBody() {
  const [openImgModal, setOpenImgModal] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const { theme } = useTheme();
  const { chatId } = useParams<{ chatId: string }>();
  const { messages, addMessage, setMessages } = useMessages();
  const { socket } = useSocketStore();
  const { profile } = useProfileStore();
  const bodyRef = useRef<HTMLElement>(null);
  function openImageModal(src: string) {
    setOpenImgModal(true);
    setImgSrc(src);
  }
  const { data: response, isPending: isFetching } =
    useGetQuery<GetMessagesResponse>({
      enabled: true,
      route: `/chats/${chatId}/messages`,
      queryKey: ["messages", chatId],
    });
  // get the messages from the server
  useEffect(() => {
    const data = response?.data;
    console.log(data);
    if (data) {
      setMessages(data.messages);
    }
  }, [response]);
  // attach a socket io listener for new messages
  useEffect(() => {
    if (socket) {
      const handleMessage = (data: MessageEmit) => {
        // update the messages state
        // check if the message is already in state.
        console.log("data", data);
        const found = messages.find((item) => item.id === data.message.id);
        console.log("found", found);
        if (found) {
          return;
        }
        addMessage(data.message);
      };
      socket?.on("newMessage", handleMessage);
      return () => {
        socket.off("newMessage", handleMessage);
      };
    }
  }, [socket, messages]);
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
        {isFetching ? (
          <div className="h-full flex items-center justify-center">
            <Loader withBackground={false} size='lg'/>
          </div>
        ) : messages.length == 0 ? (
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
          messages.map((item, index) => {
            if (item.type === "SYSTEM") {
              return (
                <div key={index} className="flex justify-center my-5">
                  <P className="bg-brand-p1/80 dark:bg-[rgb(60,116,161)]/80 text-white py-2 px-4 rounded-3xl">
                    {item.body}
                  </P>
                </div>
              );
            } else {
              return (
                <Message
                  message={item}
                  sending={item?.sending}
                  openModal={openImageModal}
                  key={uuidv4()}
                  index={index}
                />
              );
            }
          })
        )}
      </section>
      <MediaViewModal
        src={imgSrc}
        open={openImgModal}
        setOpen={setOpenImgModal}
      />
      <DeleteMessageModal />
    </>
  );
}

export default ChatBody;

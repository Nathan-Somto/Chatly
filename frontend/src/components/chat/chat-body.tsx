import { DarkWall, LightWall } from "@/assets";
import { useTheme } from "../wrappers/theme-provider";
import { MessageSquareIcon } from "lucide-react";
import P from "../ui/typo/P";
import Message from "./message";
import { useMessages } from "@/hooks/useMessages";
import { v4 as uuidv4 } from "uuid";


function ChatBody() {
  const { theme } = useTheme();
  const messages = useMessages((state) => state.messages);
  function openImageModal(src: string) {
    console.log(src);
  }
  return (
    <section
      style={{
        backgroundImage: `url(${theme === "dark" ? DarkWall : LightWall})`,
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="mt-[75px] min-h-screen mb-16"
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
        messages.map((item) => (
          <Message message={item} openModal={openImageModal} key={uuidv4()} />
        ))
      )}
    </section>
  );
}

export default ChatBody;

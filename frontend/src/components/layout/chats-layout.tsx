import { Outlet, useParams } from "react-router-dom";
import Sidebar from "../chats/sidebar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import useSocketStore from "@/hooks/useSocket";
import ConnectionStatus from "../common/ConnectionStatus";

function ChatsLayout() {
  // data fetching of user chats comes here
  const { chatId } = useParams();
  const isChatPage = typeof chatId !== "undefined";
  const { connect, disconnect } = useSocketStore();
  useEffect(() => {
    connect(import.meta.env.VITE_IO_URL);
    return () => {
      disconnect();
    };
  }, []);
  return (
    <div>
      <ConnectionStatus />
      <Sidebar />
      <main
        className={cn(
          "lg:block hidden w-full lg:ml-[350px] bg-gray-50 min-h-screen dark:bg-background lg:w-[calc(100%-350px)]",
          isChatPage && "block"
        )}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default ChatsLayout;

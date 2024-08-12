import { Outlet, useParams } from "react-router-dom";
import Sidebar from "../chats/sidebar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import useSocketStore from "@/hooks/useSocket";
import ConnectionStatus from "../common/connection-status";
import { GetUserResponse } from "@/api-types";
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { useProfileStore } from "@/hooks/useProfile";
import { ErrorMessage } from "../common/error-message";

function ChatsLayout() {
  // data fetching of user chats comes here
  const { chatId } = useParams();
  const isChatPage = typeof chatId !== "undefined";
  const { connect, disconnect, socket /* , isConnected */ } = useSocketStore();
  const { setProfile, profile } = useProfileStore();
  const {
    data: response,
    isError,
    refetch,
  } = useGetQuery<GetUserResponse>({
    enabled: profile === null,
    queryKey: ["profile"],
    route: `/users/profile`,
    displayToast: true,
  });
  if (isError) {
    <ErrorMessage title="Failed to load user's chats" refetch={refetch} />;
  }

  useEffect(() => {
    const data = response?.data;
    if (data) {
      setProfile(data?.user);
    }
  }, [response]);
  useEffect(() => {
    let mounted = true;
    const handleReconnect = () => {
      if (profile?.id && mounted) {
        connect(import.meta.env.VITE_IO_URL, profile.id);
      }
    };
    if (mounted && profile?.id) {
      connect(import.meta.env.VITE_IO_URL, profile?.id);
      socket?.on("disconnect", handleReconnect);
    }
    return () => {
      mounted = false;     
      disconnect();
      socket?.off("disconnect", handleReconnect);
    };
  }, [profile?.id]);
  return (
    <div>
      {socket && <ConnectionStatus />}
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

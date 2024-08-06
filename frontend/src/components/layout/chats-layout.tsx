import { Outlet, useParams } from "react-router-dom";
import Sidebar from "../chats/sidebar";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import useSocketStore from "@/hooks/useSocket";
import ConnectionStatus from "../common/ConnectionStatus";
import { GetUserResponse } from "@/api-types";
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { useProfileStore } from "@/hooks/useProfile";
import { ErrorMessage } from "../common/error-message";

function ChatsLayout() {
  // data fetching of user chats comes here
  const { chatId } = useParams();
  const isChatPage = typeof chatId !== "undefined";
  const { connect, disconnect } = useSocketStore();
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
    console.log(data, response);
    if (data) {   
        setProfile(data?.user);
      }
  }, [response]);
  useEffect(() => {
    if(profile && profile.id) {
      connect(import.meta.env.VITE_IO_URL, profile.id);
    }
    return () => {
      disconnect();
    };
  }, [profile]);
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

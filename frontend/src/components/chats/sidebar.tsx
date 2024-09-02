import { useMemo, useState } from "react";
import SidebarHeader from "./sidebar-header";
import { SettingsDrawer } from "../drawers/settingsDrawer";
import ChatList from "./chat-list";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import Search from "@/services/search";
import SearchBody from "./search-body";

function Sidebar() {
  const [openSettings, setOpenSettings] = useState<boolean>(false);
  const [keywords, setKeywords] = useState<string>("");
  const value = useDebounce(keywords, 500);
  const { chatId } = useParams();
  // Conversations fetching will happen here
  const {
    searchData,
    isPending: isSearching,
    isError,
  } = Search({
    keyword: keywords,
    usersOnly: false,
    enabled: keywords.length > 0 && value === keywords,
  });

  async function handleSearch(keywords: string) {
    setKeywords(keywords);
  }

  const isChatPage = typeof chatId !== "undefined";

  const concatenatedData = useMemo(() => {
    return searchData?.data
      ? [...searchData.data.users, ...(searchData.data?.groupChats ?? [])]
      : [];
  }, [searchData?.data]);
  const resultLength = concatenatedData.length;
  return (
    <>
      <aside
        className={cn(
          "lg:w-[350px] py-6 lg:fixed lg:left-0 lg:top-0 w-full bg-gray-100 dark:bg-[#17191C] border-r min-h-screen",
          isChatPage && "hidden lg:block"
        )}
      >
        <SidebarHeader
          openDrawer={setOpenSettings}
          handleSearch={handleSearch}
          showBack={keywords !== ""}
          goBackToChats={setKeywords}
        />
        {value.length > 0 ? (
          <SearchBody
            isError={isError}
            isSearching={isSearching}
            keyword={keywords}
            data={concatenatedData}
            resultLength={resultLength}
          />
        ) : (
          <ChatList />
        )}
      </aside>
      <SettingsDrawer isOpen={openSettings} openDrawer={setOpenSettings} />
    </>
  );
}

export default Sidebar;
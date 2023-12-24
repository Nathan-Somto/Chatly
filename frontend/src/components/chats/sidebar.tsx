import { useState } from 'react';
import SidebarHeader from './sidebar-header'
import { SettingsDrawer } from '../drawers/settingsDrawer';
import ChatList from './chat-list';
import { cn } from '@/lib/utils';
import { useParams } from 'react-router-dom';
import P from '../ui/typo/P';

function Sidebar() {
    const [openSettings, setOpenSettings]= useState<boolean>(false);
    const [searchData, setSearchData] = useState<string>('') 
    // conversations fetching will happen here
    async function handleSearch(keywords: string) {
        setSearchData(keywords);
        console.log(keywords);
    }
    const {chatId} = useParams();
    const isChatPage = typeof chatId !== 'undefined'
  return (
    <>
   <aside className={cn("lg:w-[350px] py-6 lg:fixed lg:left-0 lg:top-0 w-full bg-white dark:bg-gray-900 border-r min-h-screen", isChatPage&& "hidden lg:block")}>
    <SidebarHeader
     openDrawer={setOpenSettings}
     handleSearch={handleSearch}
      showBack={searchData !== ''}
      goBackToChats={setSearchData}
    />
    {
        searchData ? (
        <>
        <div className="border-b mb-2 pb-4 px-3 mt-3">
          <P className="font-medium ">3 results </P>
        </div>
        <p className="mt-8">what you searched for {searchData}</p>
        </>
        ) : (
            <ChatList/>
        )
    }
   </aside>
   <SettingsDrawer
    isOpen={openSettings}
    openDrawer={setOpenSettings}
   />
    </>
  )
}

export default Sidebar
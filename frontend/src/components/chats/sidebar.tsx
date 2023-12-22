import { useState } from 'react';
import SidebarHeader from './sidebar-header'
import { SettingsDrawer } from '../drawers/settingsDrawer';
import ChatList from './chat-list';

function Sidebar() {
    const [openSettings, setOpenSettings]= useState<boolean>(false);
    const [searchData, setSearchData] = useState<string>('') 
    // conversations fetching will happen here
    async function handleSearch(keywords: string) {
        setSearchData(keywords);
        console.log(keywords);
    }
  return (
    <>
   <aside className="lg:w-[350px] py-6 px-3 lg:fixed lg:left-0 lg:top-0 w-full bg-white dark:bg-gray-900 border-r min-h-screen">
    <SidebarHeader
     openDrawer={setOpenSettings}
     handleSearch={handleSearch}
      showBack={searchData !== ''}
      goBackToChats={setSearchData}
    />
    {
        searchData ? (<p className="mt-8">what you searched for {searchData}</p>) : (
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
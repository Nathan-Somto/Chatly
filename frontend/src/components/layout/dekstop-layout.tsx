import { Outlet } from 'react-router-dom'
import Sidebar from '../chats/sidebar'

function DesktopLayout() {
    // data fetching of user chats comes here
  return (
   <div>
   <Sidebar/>
    <main className="lg:block hidden ml-[350px] bg-gray-100 min-h-screen dark:bg-gray-900 w-[calc(100%-350px)]">
        <Outlet/>
    </main>
   </div>
  )
}

export default DesktopLayout
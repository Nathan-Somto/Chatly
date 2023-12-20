import { Outlet } from 'react-router-dom'

function DesktopLayout() {
    // data fetching of user chats comes here
  return (
   <div>
   
    <main>
        <Outlet/>
    </main>
   </div>
  )
}

export default DesktopLayout
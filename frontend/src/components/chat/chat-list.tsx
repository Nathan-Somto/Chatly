import { MenuIcon } from 'lucide-react'

function ChatList() {
  return (
    <aside>
        <div>
            <MenuIcon/>
        </div>
        <search>{'Search bar'}</search>
        <p>{'Chat List'}</p>
    </aside>
  )
}

export default ChatList
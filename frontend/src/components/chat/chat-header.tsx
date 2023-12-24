import { avatar2 } from '@/assets'
import { useNavigate, useParams } from 'react-router-dom'
import P from '../ui/typo/P';
import H2 from '../ui/typo/H2';
import { Button } from '../ui/button';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';
import GroupIcon from '../drawers/settingsDrawer/GroupIcon';

function ChatHeader() {
    const {chatId} = useParams();
    const isGroup = chatId?.includes('1234');
    const members = ['casey', 'ben', 'johnny', 'bill', 'fin'];
    const isOnline = true;
    const navigate = useNavigate();
    const userId = `12345`
  return (
    <header className="flex h-16 items-center justify-between px-4 py-5 bg-white dark:bg-gray-800 w-full lg:w-[calc(100%-350px)]  fixed top-0 z-[50] border-b">
        <Button variant={'ghost'} className="lg:hidden" size="icon" onClick={() => navigate(`/${userId}/chats`)}>
            <ChevronLeft/>
        </Button>
        <div className="flex max-lg:w-[60%] max-lg:flex-shrink-0 flex-row-reverse lg:gap-5 justify-between  lg:items-center lg:flex-row">
            <figure className="h-12 w-12 overflow-hidden text-slate-500 flex rounded-full items-center justify-center border border-brand-p2">
                {isGroup ? (
                    <GroupIcon className='h-7 w-7'/>
                ) : (
                <img src={avatar2} alt="other user avatar" className="h-full w-full"/>
                )
                }
            </figure>
            <div className="text-center lg:text-left" >
                <H2 className="text-xl">{isGroup ? 'Friends': 'Casey'}</H2>
                <P className='text-sm font-light'>{isGroup ? members.slice(0,3).join(', '): isOnline ? 'Online': "Last seen 8:20pm"}</P>
            </div>
        </div>
        <Button variant={'ghost'} className=' hidden lg:block !p-0' size="icon">
            <MoreHorizontal size={25}/>
            <span className="sr-only">Chat menu</span>
        </Button>
    </header>
  )
}

export default ChatHeader
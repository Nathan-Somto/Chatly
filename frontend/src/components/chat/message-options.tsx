import React from 'react'
import { ContextMenu, ContextMenuItem, ContextMenuContent, ContextMenuTrigger } from '../ui/context-menu'
import { CopyIcon, FlagIcon,  PenIcon, ReplyIcon, TrashIcon } from 'lucide-react'

import toast from 'react-hot-toast';
import { useMessageOptions } from '@/hooks/useMessageOptions';
type Props = {
    isOwn: boolean;
    handleReply?: () => void;
    openDeleteModal?: (id: string) => void;
    bodyText?: string;
    id: string;
    replyTo: ReplyTo,
    editMessage: EditMessage
    children: React.ReactNode
}
function MessageOptions({children, isOwn, bodyText, id, replyTo, editMessage}: Props) {
    const {onEdit, onReply, toggleDeleteModal} = useMessageOptions();
    function handleCopy(){
        if(!bodyText) return;
        navigator.clipboard.writeText(bodyText);
        toast.success("copied message!")
    }
  return (
    <ContextMenu>
        <ContextMenuTrigger asChild>
            {children}
        </ContextMenuTrigger>
        <ContextMenuContent  className='bg-gray-50  dark:bg-[#17191C] space-y-1  rounded-md z-[9999]  py-3 px-1.5 w-[225px]'>
            <ContextMenuItem onClick={() => onReply(replyTo)} className="gap-2 py-2 px-4 justify-start hover:opacity-80">
                <ReplyIcon className='!opacity-50 h-5 w-5'/>
                Reply
            </ContextMenuItem>
            <ContextMenuItem onClick={handleCopy} className="gap-2 py-2 px-4 justify-start hover:opacity-80 ">
                <CopyIcon className='!opacity-50 h-5 w-5'/>
                Copy Text
            </ContextMenuItem>
           
            <ContextMenuItem className="gap-2 py-2 px-4 justify-start hover:opacity-80">
                <FlagIcon className='!opacity-50 h-5 w-5'/>
                Flag Message
            </ContextMenuItem>
            {isOwn && (<>
                <ContextMenuItem onClick={() => onEdit(editMessage)} className="gap-2 py-2 px-4 justify-start hover:opacity-80 ">
                <PenIcon className='!opacity-50 h-5 w-5'/>
                Edit Message
            </ContextMenuItem>
            <ContextMenuItem onClick={() => toggleDeleteModal({
                id,
                open: true
            })} className="text-destructive hover:text-destructive gap-2 py-2 px-4 justify-start hover:opacity-80">
                <TrashIcon className='h-5 w-5'/>
                Delete Message
            </ContextMenuItem>
            </>)}
        </ContextMenuContent>
    </ContextMenu>
  )
}

export default MessageOptions
import { MessagesSquareIcon } from 'lucide-react'
import React from 'react'
import P from '../ui/typo/P'

export function EmptyState() {
  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <div className="rounded-full bg-brand-p1  border-2 mb-2 border-[rgb(49,102,145)] h-[70px] w-[70px] flex items-center justify-center text-gray-100">
        <MessagesSquareIcon size={35}/>
      </div>
      <P className="text-lg font-medium text-muted-foreground">Welcome to chatly click a chat to start a conversation</P>
    </div>
  )
}

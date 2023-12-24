import { avatar1, avatar2,avatar3 } from "@/assets"
import { ChatBoxType } from "."
import {v4 as uuidv4} from 'uuid'
import ChatBox from "./chat-box"
const data: ChatBoxType[] = [
 
  {
    id: uuidv4(),
    isGroup: false,
    message: 
      {
        createdAt: new Date(),
        body: "hey whats up",
        readBy: [
          {userId:"123"},
          {userId:"12346"},
          {userId:"12345"}
        ]
      },
      name : "",
      members : [
        {
          user: {
            avatar:avatar2,
            username: "Shelia"
          }
        }
      ]
    
  },
  {
    id: uuidv4(),
    isGroup: true,
    message:       
      {
        createdAt: new Date(),
        body: "who knew that a group could be cool",
        readBy: [
          {userId:"123"},
          {userId:"1234"},
          {userId:"123456"}
        ]
      },
      name : "Some random ass Group Chat",
      members :[
        {
          user: {
            avatar:avatar1,
            username: "Greg"
          }
        },
        {
          user: {
            avatar:avatar2,
            username: "Jill"
          }
        }
      ]
    
  },
  {
    id: uuidv4(),
    isGroup: false,
    message: 
      {
        createdAt: new Date(),
        body: "Chatly is such an amazing tool",
        readBy: [
          {userId:"123"},
          {userId:"12343"},
          {userId:"123455"}
        ]
      },
      name : "",
      members : [
        {
        user: {
          avatar:avatar3,
          username: "michael"
        }
        }
      ]
    
  }
]
function ChatList() {
  return (
    <section className="mt-8 px-3 space-y-1 lg:h-[calc(100%-16*0.25rem)] lg:overflow-auto">
      {
        data.map((item) => <ChatBox {...item} key={item.id}/> )
      }
    </section>
  )
}

export default ChatList
import { avatar1, avatar2,avatar3 } from "@/assets"
import { ChatBoxType } from "."
import {v4 as uuidv4} from 'uuid'
import ChatBox from "./chat-box"
import ListContainer from "../common/list-container"
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
            username: "Shelia",
            id: "1234",
            lastSeen: new Date()
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
            username: "Greg",
            id: '12345',
            lastSeen: new Date()
          }
        },
        {
          user: {
            avatar:avatar2,
            username: "Jill",
            id: '123456',
            lastSeen: new Date()
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
          username: "michael",
          id: '1234567',
          lastSeen: new Date()
        }
        }
      ]
    
  }
]
function ChatList() {
  return (
    <ListContainer>
      {
        data.map((item) => <ChatBox {...item} key={item.id}/> )
      }
    </ListContainer>
  
  )
}

export default ChatList
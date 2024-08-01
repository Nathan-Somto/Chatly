import { create } from "zustand";
/* import { v4 as uuidv4 } from "uuid";
import { avatar1 } from "@/assets"; */
/* const messages: Message["message"][] = [
    {
      Sender: {
        id: "user2",
        username: "Jane",
        avatar:
          "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw0Mzg2NzUyfHxlbnwwfHx8fHw%3D",
        Member: [
          {
            role: "MEMBER",
          },
        ],
      },
      id: uuidv4(),
      body: "Hi how are you!",
      senderId: "user2",
      isEditted: false,
      readByIds: ["user1"],
      resourceUrl: null,
      type: "TEXT",
      createdAt: new Date("2023-01-01T12:00:00"),
      chatId: "dm1",
      isReply: false,
      parentMessage: null
    },
    {
      Sender: {
        id: "user2",
        username: "Jane",
        avatar:
          "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw0Mzg2NzUyfHxlbnwwfHx8fHw%3D",
        Member: [
          {
            role: "MEMBER",
          },
        ],
      },
      id: uuidv4(),
      body: "I found this cute looking christmas image",
      senderId: "user2",
      isEditted: true,
      readByIds: ["user1"],
      resourceUrl:
        "https://images.unsplash.com/photo-1482517716521-3120e5340ed3?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVycnklMjBjaHJpc3RtYXN8ZW58MHx8MHx8fDA%3D",
      type: "IMAGE",
      createdAt: new Date("2023-03-01T12:05:00"),
      chatId: "dm1",
      isReply: false,
      parentMessage: null
    },
    {
      Sender: {
        id: "user2",
        username: "User2",
        avatar:
          "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw0Mzg2NzUyfHxlbnwwfHx8fHw%3D",
        Member: [
          {
            role: "MEMBER",
          },
        ],
      },
      id: uuidv4(),
      body: "Christmas is the most wonderful time of the year!",
      senderId: "user2",
      isEditted: false,
      readByIds: ["user1"],
      resourceUrl: null,
      type: "TEXT",
      createdAt: new Date("2023-08-01T12:05:00"),
      chatId: "dm1",
      isReply: false,
      parentMessage: null
    },
    {
      Sender: {
        id: "user2",
        username: "Jane",
        avatar:"",
        Member: [
          {
            role: "MEMBER",
          },
        ],
      },
      id: uuidv4(),
      body: "You betcha",
      senderId: "user1",
      isEditted: false,
      readByIds: [],
      resourceUrl: null,
      type: "TEXT",
      createdAt: new Date("2023-08-01T12:05:00"),
      chatId: "dm1",
      isReply: false,
      parentMessage: null
    },
    {
      Sender: {
        id: "user2",
        username: "Jane",
        avatar:
          "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw0Mzg2NzUyfHxlbnwwfHx8fHw%3D",
        Member: [
          {
            role: "MEMBER",
          },
        ],
      },
      id: uuidv4(),
      body: "That song just gets me in the mood",
      senderId: "user2",
      isEditted: false,
      readByIds: ["user1"],
      resourceUrl: null,
      type: "TEXT",
      createdAt: new Date("2023-08-01T12:05:00"),
      chatId: "dm1",
      isReply: false,
      parentMessage: null
    },
    
    {
      Sender: {
        id: "user2",
        username: "Nathan",
        avatar:"",
        Member: [
          {
            role: "MEMBER",
          },
        ],
      },
      id: uuidv4(),
      body: "I Hope santa comes with presents this year",
      senderId: "user1",
      isEditted: false,
      readByIds: [],
      resourceUrl: null,
      type: "TEXT",
      createdAt: new Date("2023-08-01T12:05:00"),
      chatId: "dm1",
      isReply: false,
      parentMessage: null
    },
    {
      Sender: {
        id: "user2",
        username: "User2",
        avatar:
          "",
        Member: [
          {
            role: "MEMBER",
          },
        ],
      },
      id: uuidv4(),
      body: "I am definitely looking forward to the new year!",
      senderId: "user1",
      isEditted: false,
      readByIds: [],
      resourceUrl: null,
      type: "TEXT",
      createdAt: new Date("2023-08-01T12:05:00"),
      chatId: "dm1",
      isReply: false,
      parentMessage: null
    },
    {
      Sender: {
        id: "user2",
        username: "User2",
        avatar:
         "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw0Mzg2NzUyfHxlbnwwfHx8fHw%3D",
        Member: [
          {
            role: "MEMBER",
          },
        ],
      },
      id: "1234567",
      body: "Can you share your instagram account",
      senderId: "user2",
      isEditted: false,
      readByIds: [],
      resourceUrl: null,
      type: "TEXT",
      createdAt: new Date("2023-08-01T12:05:00"),
      chatId: "dm1",
      isReply: false,
      parentMessage: null
    },
    {
      Sender: {
        id: "user1",
        username: "User1",
        avatar:
          "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXBhZ2V8MXw0Mzg2NzUyfHxlbnwwfHx8fHw%3D",
        Member: [
          {
            role: "MEMBER",
          },
        ],
      },
      id: uuidv4(),
      body: "here you go\nhttps://www.instagram.com",
      senderId: "user1",
      isEditted: false,
      readByIds: [],
      resourceUrl: null,
      type: "TEXT",
      createdAt: new Date("2023-08-01T12:05:00"),
      chatId: "dm1",
      isReply: true,
      parentMessage:{
        body: "Can you share your instagram account",
        avatar: avatar1,
        username: "User2"
      }
    },
  ]; */
export type ModifiedMessage = Message["message"]& 
{
    sending?:boolean; 
    failed?:boolean;
}
type Messages = ModifiedMessage[];
interface MessagesState {
  messages: Messages;
  setMessages: (data: Messages) => void;
  addMessage: (data: ModifiedMessage) => void;
}

const useMessages = create<MessagesState>((set) => ({
  messages: [],
  setMessages: (data) => set(() => ({ messages: data })),
  addMessage: (data) =>
    set((state) => ({
      messages: [...state.messages,data],
    })),
}));

// updating / deleting a message will be done by the comp that requires it.
export {useMessages}
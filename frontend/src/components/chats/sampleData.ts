import { avatar1, avatar2, avatar3 } from "@/assets";
import { ChatBoxType } from ".";
import { v4 as uuidv4 } from "uuid";
const data: ChatBoxType[] = [
  {
    id: uuidv4(),
    isGroup: false,
    message: {
      createdAt: new Date(),
      body: "hey whats up",
      readByIds: ["123", "1234", "123456"],
      type: "TEXT",
      senderId: "123",
    },
    name: "Shelia",
    avatars: [avatar1],
    lastSeen: new Date(),
  },
  {
    id: uuidv4(),
    isGroup: true,
    message: {
      createdAt: new Date(),
      body: "who knew that a group could be cool",
      readByIds: ["123", "1234", "123456"],
      type: "TEXT",
      senderId: "123",
    },
    name: "Some random ass Group Chat",
    avatars: [avatar1, avatar2],
  },
  {
    id: uuidv4(),
    isGroup: false,
    message: {
      createdAt: new Date(),
      body: "Chatly is such an amazing tool",
      readByIds: ["123", "1234", "123456"],
      type: "TEXT",
      senderId: "345",
    },
    name: "Michael",
    avatars: [avatar3],
    lastSeen: new Date(),
  },
];
export { data };

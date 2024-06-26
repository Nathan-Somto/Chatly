import { create } from "zustand";
import {persist} from "zustand/middleware";
// when i click a chat this is responsible for filling the chat header
// this is also respondsible for setting messages, updating and deleting a message.
export type ActiveChat = {
  groupInfo: {
    name: string;
    members: {
     user: { 
      username: string;
      avatar: string;
      lastSeen: Date;
      id: string;
     }
    }[];
    id: string;
    isGroup: boolean;
  } | null;
  dmInfo: {
    username: string;
    avatar: string;
    lastSeen: Date;
    id: string;
  } | null;
  //messages: Message[];
} | null;
interface ActiveChatState {
  activeChat: ActiveChat;
  setActiveChat: (data: ActiveChat) => void;
  reset: () => void;
}
const initialChat: ActiveChat = null;
type Store = (set: (partial: ActiveChatState | Partial<ActiveChatState> | ((state: ActiveChatState) => ActiveChatState | Partial<ActiveChatState>), replace?: boolean | undefined) => void) => ActiveChatState 
let store: Store = (set) => ({
  activeChat: initialChat,
  setActiveChat: (data: ActiveChat) => set(() => ({ activeChat: data })),
  reset: () => {
    set({ activeChat: initialChat });
  },
})

/**@todo handle last Seen update */
const useActiveChat = create<ActiveChatState>()(persist(store, {name: "activeChat"}));

export {useActiveChat}
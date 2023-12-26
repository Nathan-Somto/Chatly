import { create } from "zustand";
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
  messages: Message[];
} | null;
interface ActiveChatState {
  activeChat: ActiveChat;
  setActiveChat: (data: ActiveChat) => void;
  setMessages: (data: Message[]) => void;
  addMessage: (data: Message) => void;
  reset: () => void;
}
const initialChat: ActiveChat = null;
/**@todo handle last Seen update */
const useActiveChat = create<ActiveChatState>((set) => ({
  activeChat: initialChat,
  setActiveChat: (data: ActiveChat) => set(() => ({ activeChat: data })),
  setMessages: (data: Message[]) =>
    set((state) => ({
      activeChat: {
        dmInfo: state.activeChat?.dmInfo ?? null,
        groupInfo: state.activeChat?.groupInfo ?? null,
        messages: data,
      },
    })),
  addMessage: (data: Message) =>
    set((state) => ({
      activeChat: {
        dmInfo: state.activeChat?.dmInfo ?? null,
        groupInfo: state.activeChat?.groupInfo ?? null,
        messages:
          state.activeChat?.messages !== undefined
            ? [data, ...state.activeChat.messages]
            : [data],
      },
    })),
  reset: () => {
    set({ activeChat: initialChat });
  },
}));

export {useActiveChat}
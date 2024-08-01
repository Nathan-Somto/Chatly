import { create } from "zustand";
import { persist } from "zustand/middleware";
// when i click a chat this is responsible for filling the chat header
// this is also respondsible for setting messages, updating and deleting a message.
export type ActiveChat = {
  groupInfo: {
    id: string;
    isGroup: boolean;
    name: string;
    avatars: string[];
    members?: string[];
  } | null;
  dmInfo: {
    avatar: string;
    username: string;
    id: string;
    lastSeen: Date | undefined;
  } | null;
  //messages: Message[];
} | null;
interface ActiveChatState {
  activeChat: ActiveChat;
  setActiveChat: (data: ActiveChat) => void;
  updateLastSeen: (lastSeen: Date) => void;
  reset: () => void;
}
const initialChat: ActiveChat = null;
type Store = (
  set: (
    partial:
      | ActiveChatState
      | Partial<ActiveChatState>
      | ((
          state: ActiveChatState
        ) => ActiveChatState | Partial<ActiveChatState>),
    replace?: boolean | undefined
  ) => void
) => ActiveChatState;
let store: Store = (set) => ({
  activeChat: initialChat,
  setActiveChat: (data: ActiveChat) => set(() => ({ activeChat: data })),
  updateLastSeen: (lastSeen: Date) => {
    set((state) => {
      if (state.activeChat?.dmInfo) {
        state.activeChat.dmInfo.lastSeen = lastSeen;
      }
      return state;
    });
  },
  reset: () => {
    set({ activeChat: initialChat });
  },
});

/**@todo handle last Seen update */
const useActiveChat = create<ActiveChatState>()(
  persist(store, { name: "activeChat" })
);

export { useActiveChat };

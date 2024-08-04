import { create } from "zustand";
import { persist } from "zustand/middleware";
// when i click a chat this is responsible for filling the chat header with the chat info
export type ActiveChat = {
  groupInfo: {
    id: string;
    isGroup: boolean;
    name: string;
    avatars: string[];
    members?: string[];
    description?: string | null; 
    inviteCode?: string | null;
  } | null;
  dmInfo: {
    avatar: string;
    username: string;
    id: string;
    lastSeen: Date | undefined;
    bio?: string | null;
    email?: string | null;
  } | null;
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

// helps to keep track of the chats
import create from 'zustand';
import { ChatBoxType } from '../components/chats/index.d';

type ChatState = {
    chatList: ChatBoxType[];
    setChatList: (chats: ChatBoxType[]) => void;
    addChat: (chat: ChatBoxType) => void;
    updateChat: (chat: ChatBoxType) => void;
    removeChat: (id: string) => void;
};

const useChatStore = create<ChatState>((set) => ({
    chatList: [],
    setChatList: (chats) => set({ chatList: chats }),
    addChat: (chat) => set((state) => ({ chatList: [...state.chatList, chat] })),
    updateChat: (updatedChat) => set((state) => ({
        chatList: state.chatList.map(chat => chat.id === updatedChat.id ? updatedChat : chat)
    })),
    removeChat: (id) => set((state) => ({
        chatList: state.chatList.filter(chat => chat.id !== id)
    })),
}));

export default useChatStore;

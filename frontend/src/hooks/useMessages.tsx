import { create } from "zustand";
export type ModifiedMessage = Message & 
{
    sending?:boolean; 
    failed?:boolean;
}
export type Messages = ModifiedMessage[];
interface MessagesState {
  messages: Messages | null;
  setMessages: (data: Messages | null) => void;
  addMessage: (data: ModifiedMessage) => void;
  resetMessages: () => void;
}

const useMessages = create<MessagesState>((set) => ({
  messages: null,
  setMessages: (data) => set(() => ({ messages: data })),
  addMessage: (data) =>
    set((state) => ({
      messages: state.messages ? [...state.messages, data] : [data],
    })),
  resetMessages: () => set(() => ({ messages: null })),
}));

// updating / deleting a message will be done by the comp that requires it.
export {useMessages}
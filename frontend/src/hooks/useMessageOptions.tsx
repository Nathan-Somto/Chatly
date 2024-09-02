import { create } from "zustand";

type MessageOptions = {
  replyTo: ReplyTo | null;
  editMessage: EditMessage | null;
  deleteModal: {
    id: string;
    open: boolean;
    index: number;
  };
  disabled: boolean;
};
type MessageOptionsState = {
  messageOptions: MessageOptions;
  onEdit: (message: EditMessage | null) => void;
  onReply: (message: ReplyTo | null) => void;
  toggleDeleteModal: (deleteModal: MessageOptions["deleteModal"]) => void;
  toggleDisabled: (disabled: boolean) => void;
  resetOptions: () => void;
};
const initialState = {
  editMessage: null,
  replyTo: null,
  deleteModal: {
    id: "",
    open: false,
    index: -1,
  },
  disabled: false,
}
const useMessageOptions = create<MessageOptionsState>((set) => ({
  messageOptions: initialState,
  onEdit: (data) =>
    set((state) => ({
      messageOptions: {
        ...state.messageOptions,
        editMessage: data,
      },
    })),
  onReply: (data) =>
    set((state) => ({
      messageOptions: {
        ...state.messageOptions,
        replyTo: data,
      },
    })),
  toggleDeleteModal: (data) =>
    set((state) => ({
      messageOptions: {
        ...state.messageOptions,
        deleteModal: data,
      },
    })),
  toggleDisabled: (data) =>
    set((state) => ({
      messageOptions: {
        ...state.messageOptions,
        disabled: data,
      },
    })),
    resetOptions: () => set(() => ({messageOptions: initialState})),
}));
export { useMessageOptions };

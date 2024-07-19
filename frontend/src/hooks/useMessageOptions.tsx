import { create } from "zustand";

type MessageOptions = {
    replyTo: ReplyTo | null;
    editMessage: EditMessage | null;
    deleteModal: {
        id: string;
        open: boolean;
    };
};
type MessageOptionsState =  {
  messageOptions: MessageOptions;
  onEdit: (message: EditMessage | null) => void;
  onReply: (message: ReplyTo | null) => void;
  toggleDeleteModal: (deleteModal:{
    id: string;
    open: boolean;
  }) => void;
}

const useMessageOptions = create<MessageOptionsState>((set) => ({
  messageOptions: {
    editMessage: null,
    replyTo: null,
    deleteModal: {
        id: '',
        open: false
    }
  },
  onEdit: (data) => set((state) => ({ 
    messageOptions : {
        ...state.messageOptions,
        editMessage: data
    }
   })),
  onReply: (data) =>
    set((state) => ({
      messageOptions: {
        ...state.messageOptions,
        replyTo: data,
      }
    })),
    toggleDeleteModal: (data) =>
        set((state) => ({
          messageOptions: {
            ...state.messageOptions,
            deleteModal: data,
          }
        })),
}));
export {useMessageOptions}
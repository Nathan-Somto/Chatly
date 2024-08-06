import {create} from 'zustand';
import io, {Socket} from 'socket.io-client';

type SocketState = {
  socket: Socket | null;
  isConnected: boolean;
  connect: (url: string, userId: string) => void;
  disconnect: () => void;
};

const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  isConnected: false,
  connect: (url: string, userId: string) => {
    const socket = io(url);

    socket.on('connect', () => {
      socket.emit('userConnected', userId);
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      set({ isConnected: false });
    });

    set({ socket });
  },
  disconnect: () => {
    const { socket } = useSocketStore.getState();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));

export default useSocketStore;

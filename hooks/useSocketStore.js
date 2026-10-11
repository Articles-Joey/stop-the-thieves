import { createWithEqualityFn as create } from 'zustand/traditional'
import { io } from "socket.io-client";

import zustandSocketStoreSlice from '@articles-media/articles-dev-box/zustandSocketStoreSlice';

export const useSocketStore = create((set, get) => {
    const socketSlice = zustandSocketStoreSlice(set, get, io);
    return {
        ...socketSlice,
        connectSocket: (url) => {
            // Block shared settings and handlers from connecting local play.
            if (typeof window !== 'undefined' && window.location.pathname === '/play'
                && !new URLSearchParams(window.location.search).get('server')) return;
            get().socket?.disconnect();
            socketSlice.connectSocket(url);
        },
        disconnectSocket: () => {
            get().socket?.disconnect();
            set({ connected: false, authenticated: false });
        },
    };
});

import { create } from 'zustand'
import { io } from 'socket.io-client'
import { useNotificationStore } from './useNotificationStore'
import { useActivityStore } from './useActivityStore'
import toast from 'react-hot-toast'

export const useSocketStore = create((set, get) => ({
    socket: null,

    connectSocket: () => {
        const socket = io('http://localhost:3000', {
            withCredentials: true,
        });

        socket.on('connect', () => {
            console.log('Connected to socket server:', socket.id);
        });

        socket.on('receiveNotification', (notification) => {
            useNotificationStore.getState().addNotification(notification);
            toast("You have a new notification!", { icon: '🔔' });
        });

        socket.on('receiveTaskActivity', (activity) => {
            useActivityStore.getState().addActivity(activity);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        set({ socket });
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket?.connected) {
            socket.disconnect();
            set({ socket: null });
        }
    }
}))

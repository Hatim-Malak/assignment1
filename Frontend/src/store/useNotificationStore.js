import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useNotificationStore = create((set) => ({
    notifications: [],
    isLoading: false,

    getNotifications: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get('/notifications');
            set({ notifications: res.data.notifications || res.data });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to load notifications");
        } finally {
            set({ isLoading: false });
        }
    },

    markAsRead: async (id) => {
        try {
            const res = await axiosInstance.patch(`/notifications/${id}/read`);
            const updatedNotification = res.data.notification || res.data;
            set((state) => ({
                notifications: state.notifications.map((n) => 
                    n.id === id ? updatedNotification : n
                )
            }));
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to mark as read");
        }
    },

    markAllAsRead: async () => {
        try {
            await axiosInstance.patch('/notifications/mark-all-read');
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, is_read: true }))
            }));
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to mark all as read");
        }
    },

    deleteNotification: async (id) => {
        try {
            await axiosInstance.delete(`/notifications/${id}`);
            set((state) => ({
                notifications: state.notifications.filter((n) => n.id !== id)
            }));
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to delete notification");
        }
    },

    addNotification: (notification) => {
        set((state) => ({
            notifications: [notification, ...state.notifications]
        }));
    }
}))

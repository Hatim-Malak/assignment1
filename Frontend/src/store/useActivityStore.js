import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useActivityStore = create((set) => ({
    activities: [],
    isLoading: false,

    getActivities: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get('/activity');
            set({ activities: res.data.activities || res.data });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to load activity logs");
        } finally {
            set({ isLoading: false });
        }
    },

    addActivity: (activity) => {
        set((state) => ({
            activities: [activity, ...state.activities]
        }));
    }
}))

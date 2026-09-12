import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useDashboardStore = create((set) => ({
    dashboardData: null,
    isLoading: false,

    getDashboardData: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get('/dashboard');
            set({ dashboardData: res.data });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to load dashboard data");
        } finally {
            set({ isLoading: false });
        }
    }
}))

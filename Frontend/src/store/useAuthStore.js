import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import { useSocketStore } from './useSocketStore.js'
import toast from 'react-hot-toast'

export const useAuthstore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,

    checkAuth: async () => {
        try {
            // On reload, first attempt to get a new access token using the HTTP-only refresh cookie
            const refreshRes = await axiosInstance.post('/users/refresh-token');
            const token = refreshRes.data.accessToken;
            
            // Set the token for all future axios requests
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const res = await axiosInstance.get('/users/me'); // The route is /users/me in user.routes.js
            set({ authUser: res.data.user || res.data });
            useSocketStore.getState().connectSocket();
        } catch (error) {
            console.log("Error in checkAuth:", error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/users/register', data);
            
            // Assuming register returns an accessToken like login does, if not, they must login after
            if (res.data.accessToken) {
                axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
            }

            set({ authUser: res.data.user });
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to create account");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post('/users/login', data);
            
            // Save the access token in Axios defaults so it's attached to all subsequent requests
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
            
            set({ authUser: res.data.user });
            useSocketStore.getState().connectSocket();
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response?.data?.error || "Invalid credentials");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/users/logout');
            
            // Clear the token from Axios
            delete axiosInstance.defaults.headers.common['Authorization'];
            
            set({ authUser: null });
            useSocketStore.getState().disconnectSocket();
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to logout");
        }
    }
}))

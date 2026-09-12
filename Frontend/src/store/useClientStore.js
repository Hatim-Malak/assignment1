import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useClientStore = create((set) => ({
    clients: [],
    isLoading: false,

    getClients: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get('/clients');
            set({ clients: res.data.clients || res.data });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to load clients");
        } finally {
            set({ isLoading: false });
        }
    },

    createClient: async (clientData) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post('/clients', clientData);
            set((state) => ({ 
                clients: [...state.clients, res.data.client || res.data] 
            }));
            toast.success("Client created successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to create client");
        } finally {
            set({ isLoading: false });
        }
    },

    updateClient: async (id, clientData) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.patch(`/clients/${id}`, clientData);
            const updatedClient = res.data.client || res.data;
            set((state) => ({
                clients: state.clients.map((c) => 
                    c.id === id ? updatedClient : c
                )
            }));
            toast.success("Client updated successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to update client");
        } finally {
            set({ isLoading: false });
        }
    },

    deleteClient: async (id) => {
        set({ isLoading: true });
        try {
            await axiosInstance.delete(`/clients/${id}`);
            set((state) => ({
                clients: state.clients.filter((c) => c.id !== id)
            }));
            toast.success("Client deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to delete client");
        } finally {
            set({ isLoading: false });
        }
    }
}))

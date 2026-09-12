import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useTaskStore = create((set) => ({
    tasks: [],
    isLoading: false,

    getTasks: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const res = await axiosInstance.get(`/tasks?${queryParams}`);
            set({ tasks: res.data.tasks || res.data });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to load tasks");
        } finally {
            set({ isLoading: false });
        }
    },

    createTask: async (taskData) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post('/tasks', taskData);
            set((state) => ({ 
                tasks: [...state.tasks, res.data.task || res.data] 
            }));
            toast.success("Task created successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to create task");
        } finally {
            set({ isLoading: false });
        }
    },

    updateTask: async (id, taskData) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.patch(`/tasks/${id}`, taskData);
            const updatedTask = res.data.task || res.data;
            set((state) => ({
                tasks: state.tasks.map((t) => 
                    t.id === id ? updatedTask : t
                )
            }));
            toast.success("Task updated successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to update task");
        } finally {
            set({ isLoading: false });
        }
    },

    updateTaskStatus: async (id, status) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.patch(`/tasks/${id}/status`, { status });
            const updatedTask = res.data.task || res.data;
            set((state) => ({
                tasks: state.tasks.map((t) => 
                    t.id === id ? updatedTask : t
                )
            }));
            toast.success("Task status updated");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to update task status");
        } finally {
            set({ isLoading: false });
        }
    },

    deleteTask: async (id) => {
        set({ isLoading: true });
        try {
            await axiosInstance.delete(`/tasks/${id}`);
            set((state) => ({
                tasks: state.tasks.filter((t) => t.id !== id)
            }));
            toast.success("Task deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to delete task");
        } finally {
            set({ isLoading: false });
        }
    }
}))

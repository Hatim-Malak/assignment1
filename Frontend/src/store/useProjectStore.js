import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'

export const useProjectStore = create((set, get) => ({
    projects: [],
    isLoading: false,
    
    getProjects: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get('/projects');
            set({ projects: res.data.projects || res.data });
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error(error.response?.data?.error || "Failed to load projects");
        } finally {
            set({ isLoading: false });
        }
    },

    createProject: async (projectData) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post('/projects', projectData);
            set((state) => ({ 
                projects: [...state.projects, res.data.project || res.data] 
            }));
            toast.success("Project created successfully");
        } catch (error) {
            console.error("Error creating project:", error);
            toast.error(error.response?.data?.error || "Failed to create project");
        } finally {
            set({ isLoading: false });
        }
    },

    updateProject: async (id, projectData) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.patch(`/projects/${id}`, projectData);
            const updatedProject = res.data.project || res.data;
            
            set((state) => ({
                projects: state.projects.map((p) => 
                    p.id === id ? updatedProject : p
                )
            }));
            toast.success("Project updated successfully");
        } catch (error) {
            console.error("Error updating project:", error);
            toast.error(error.response?.data?.error || "Failed to update project");
        } finally {
            set({ isLoading: false });
        }
    },

    deleteProject: async (id) => {
        set({ isLoading: true });
        try {
            await axiosInstance.delete(`/projects/${id}`);
            set((state) => ({
                projects: state.projects.filter((p) => p.id !== id)
            }));
            toast.success("Project deleted successfully");
        } catch (error) {
            console.error("Error deleting project:", error);
            toast.error(error.response?.data?.error || "Failed to delete project");
        } finally {
            set({ isLoading: false });
        }
    }
}))

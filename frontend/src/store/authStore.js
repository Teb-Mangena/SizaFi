import { create } from 'zustand'
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
  user: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/user/check');
      set({ user: res.data.user });
    } catch (error) {
      console.log('Error in check auth', error);
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/user/logout");
      set({ user: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/user/signup", data);
      set({ user: res.data });

      toast.success("Account created successfully!");
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed";
      toast.error(message);
      console.log("Signup error:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/user/login", data);
      set({ user: res.data });
      toast.success("Logged in successfully!");
    } catch (error) {
      console.log("Login error:", error);
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
    } finally {
      set({ isLoggingIn: false });
    }
  }

}));
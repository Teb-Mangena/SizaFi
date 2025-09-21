import axios from 'axios';

// const apiUrl = import.meta.env.VITE_API_URL

// console.log({apiUrl})
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://sizafi-backend.onrender.com/api',
  withCredentials: true
});
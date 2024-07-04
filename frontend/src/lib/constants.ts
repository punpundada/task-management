import axios from "axios";
import env from "./env";

export const axiosInstance = axios.create({
  baseURL: env.VITE_BACKEND_BASE_URL, // Replace with your API base URL
  withCredentials: true,
  headers:{
    'Access-Control-Allow-Origin':"*",
  }
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

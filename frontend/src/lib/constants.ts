import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://api.example.com/", // Replace with your API base URL
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

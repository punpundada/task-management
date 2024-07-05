import axios, { AxiosError } from "axios";
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
    console.error(error)
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use((res)=>{
  return res
},(error)=>{
  if(error instanceof AxiosError && (Number(error.response?.status) === 401)){
    localStorage.removeItem('user')
  }
  return Promise.reject(error)
}
)

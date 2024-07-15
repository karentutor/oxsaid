import axios from "axios";

// export const BASE_URL = 'https://api.oxsaid.net/api';
export const BASE_URL = import.meta.env.VITE_API_URL;

export const axiosBase = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true,
});
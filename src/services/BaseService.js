import axios from "axios";

//export const BASE_URL = "https://api.oxsaid.net/api";
export const BASE_URL = "localhost:5173/api";

export const axiosBase = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true,
});

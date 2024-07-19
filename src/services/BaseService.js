import axios from "axios";

export const BASE_URL = "http://localhost:8000/api";
//export const BASE_URL = 'https://api.oxsaid.net/api';

export const axiosBase = axios.create({
  baseURL: BASE_URL,
  // withCredentials: true,
});

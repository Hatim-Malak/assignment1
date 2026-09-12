import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:30001/api",
  withCredentials: true,
});

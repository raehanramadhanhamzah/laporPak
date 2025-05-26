// src/services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data) => API.post("/register", data);
export const login = (data) => API.post("/login", data);
// export lain jika diperlukan:
export const getUsers = (params) => API.get("/users", { params });
export const getUserDetail = (id) => API.get(`/users/${id}`);
export const createReport = (formData) => API.post("/reports", formData);

export default API;

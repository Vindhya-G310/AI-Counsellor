import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (name, email, password) =>
    apiClient.post("/auth/signup", { name, email, password }),
  login: (email, password) =>
    apiClient.post("/auth/login", { email, password }),
  getMe: () => apiClient.get("/auth/me"),
};

export const onboardingAPI = {
  submit: (data) => apiClient.post("/onboarding/submit", data),
  getStatus: () => apiClient.get("/onboarding/status"),
};

export const universitiesAPI = {
  getAll: (params) => apiClient.get("/universities", { params }),
  getById: (id) => apiClient.get(`/universities/${id}`),
  shortlist: (id, data) =>
    apiClient.post(`/universities/${id}/shortlist`, data),
  removeFromShortlist: (id) =>
    apiClient.delete(`/universities/${id}/shortlist`),
  lock: (id) => apiClient.post(`/universities/${id}/lock`),
  unlock: (id) => apiClient.post(`/universities/${id}/unlock`),
  getShortlist: () => apiClient.get("/universities/user/shortlist"),
};

export const tasksAPI = {
  getAll: (params) => apiClient.get("/tasks", { params }),
  create: (data) => apiClient.post("/tasks", data),
  update: (id, data) => apiClient.patch(`/tasks/${id}`, data),
  delete: (id) => apiClient.delete(`/tasks/${id}`),
};

export const counsellorAPI = {
  analyze: () => apiClient.post("/counsellor/analyze"),
  getStatus: () => apiClient.get("/counsellor/status"),
};

export const dashboardAPI = {
  getData: () => apiClient.get("/dashboard"),
};

export default apiClient;

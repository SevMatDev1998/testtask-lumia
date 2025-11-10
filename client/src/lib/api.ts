import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sessionToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export const notesApi = {
  getAll: () => api.get<Note[]>("/api/notes"),
  getOne: (id: string) => api.get<Note>(`/api/notes/${id}`),
  create: (data: { title: string; content: string }) =>
    api.post<Note>("/api/notes", data),
  update: (id: string, data: { title?: string; content?: string }) =>
    api.put<Note>(`/api/notes/${id}`, data),
  delete: (id: string) => api.delete(`/api/notes/${id}`),
};

export const authApi = {
  verifySession: (sessionToken: string) =>
    api.post("/api/auth/verify-session", { sessionToken }),
};

import api from "./axios";

export const authService = {
  signup: async (data) => {
    const res = await api.post("/auth/signup", data);
    return res.data;
  },

  login: async (credentials) => {
    const res = await api.post("/auth/login", credentials);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get("/users/me");
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await api.put("/users/me", data);
    return res.data;
  },
};


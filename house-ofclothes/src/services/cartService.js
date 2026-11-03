import api from "./axios";

export const cartService = {
  getCart: async () => {
    const res = await api.get("/cart");
    return res.data;
  },

  addToCart: async (productId, quantity = 1) => {
    const res = await api.post("/cart/items", { productId, quantity });
    return res.data;
  },

  updateQuantity: async (productId, quantity) => {
    const res = await api.put(`/cart/items/${productId}`, { quantity });
    return res.data;
  },

  removeFromCart: async (productId) => {
    const res = await api.delete(`/cart/items/${productId}`);
    return res.data;
  },
};


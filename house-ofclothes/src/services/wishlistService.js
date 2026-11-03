import api from "./axios";

export const wishlistService = {
  getWishlist: async () => {
    const res = await api.get("/wishlist");
    return res.data;
  },

  addToWishlist: async (productId) => {
    const res = await api.post("/wishlist/items", { productId });
    return res.data;
  },

  removeFromWishlist: async (productId) => {
    const res = await api.delete(`/wishlist/items/${productId}`);
    return res.data;
  },
};

export default wishlistService;

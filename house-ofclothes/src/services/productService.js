import api from "./axios";

export const productService = {
  getProducts: async (params = {}) => {
    const res = await api.get("/products", { params });
    return res.data;
  },

  getProductById: async (id) => {
    const res = await api.get(`/products/${id}`);
    return res.data;
  },

  getCategories: async () => {
    const res = await api.get("/categories");
    return res.data;
  },
};


export default productService;
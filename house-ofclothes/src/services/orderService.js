import api from "./axios";

export const orderService = {
  placeOrder: async (orderData) => {
    const res = await api.post("/orders", orderData);
    return res.data;
  },

  getMyOrders: async () => {
    const res = await api.get("/orders/my-orders");
    return res.data;
  },
};


export default orderService;
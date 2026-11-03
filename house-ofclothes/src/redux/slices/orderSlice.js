import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';

const normalizeOrder = (response) =>
  response?.data?.order ||
  response?.order ||
  response?.data ||
  response;

const normalizeOrders = (response) => {
  const orders =
    response?.orders ||
    response?.data?.orders ||
    response?.data?.data ||
    response?.data ||
    response;
  return Array.isArray(orders) ? orders : [];
};

// ---------------------------------------------------------------------------
// Async thunks
// ---------------------------------------------------------------------------
export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const data = await orderService.placeOrder(orderData);
      const order = normalizeOrder(data);
      if (!order || typeof order !== 'object' || Array.isArray(order)) {
        return rejectWithValue('The order service returned an invalid order.');
      }
      return order;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to place order',
      );
    }
  },
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await orderService.getMyOrders();
      return normalizeOrders(data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch orders',
      );
    }
  },
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
    clearOrderError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ---- placeOrder ----
    builder
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.currentOrder = payload;
        if (!Array.isArray(state.orders)) state.orders = [];
        state.orders = [
          payload,
          ...state.orders.filter((order) => order._id !== payload._id),
        ];
      })
      .addCase(placeOrder.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ---- fetchMyOrders ----
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.orders = Array.isArray(payload) ? payload : [];
      })
      .addCase(fetchMyOrders.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearCurrentOrder, clearOrderError } = orderSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders.orders;
export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;

export default orderSlice.reducer;

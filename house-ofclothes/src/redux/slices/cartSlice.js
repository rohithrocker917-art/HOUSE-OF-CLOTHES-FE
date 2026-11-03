import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';

// ---------------------------------------------------------------------------
// Helpers – guest cart in localStorage
// ---------------------------------------------------------------------------
const GUEST_KEY = 'guest_cart';

const loadGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGuestCart = (items) => {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota errors */
  }
};

const clearGuestCart = () => localStorage.removeItem(GUEST_KEY);

const computeTotals = (items) => {
  const totalCount = items.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const totalAmount = items.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 1),
    0,
  );
  return { totalCount, totalAmount };
};

// ---------------------------------------------------------------------------
// Async thunks
// ---------------------------------------------------------------------------
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) {
      // Return guest cart directly
      return { items: loadGuestCart() };
    }
    try {
      const data = await cartService.getCart();
      return data; // { items, ... }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch cart',
      );
    }
  },
);

export const addItemToCart = createAsyncThunk(
  'cart/addItemToCart',
  async (item, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) {
      // Guest cart
      const items = loadGuestCart();
      const idx = items.findIndex(
        (i) =>
          i.productId === (item.productId || item._id) &&
          i.size === item.size &&
          i.color === item.color,
      );
      if (idx >= 0) {
        items[idx].quantity = (items[idx].quantity || 1) + (item.quantity || 1);
      } else {
        items.push({
          productId: item.productId || item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          size: item.size,
          color: item.color,
          quantity: item.quantity || 1,
        });
      }
      saveGuestCart(items);
      return { items };
    }
    try {
      const data = await cartService.addToCart(item);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to add to cart',
      );
    }
  },
);

export const updateCartItemQty = createAsyncThunk(
  'cart/updateCartItemQty',
  async ({ productId, quantity, size, color }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) {
      const items = loadGuestCart();
      const idx = items.findIndex(
        (i) =>
          i.productId === productId &&
          (!size || i.size === size) &&
          (!color || i.color === color),
      );
      if (idx >= 0) {
        items[idx].quantity = quantity;
      }
      saveGuestCart(items);
      return { items };
    }
    try {
      const data = await cartService.updateQuantity(productId, quantity);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to update cart',
      );
    }
  },
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async ({ productId, size, color }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) {
      let items = loadGuestCart();
      items = items.filter(
        (i) =>
          !(
            i.productId === productId &&
            (!size || i.size === size) &&
            (!color || i.color === color)
          ),
      );
      saveGuestCart(items);
      return { items };
    }
    try {
      const data = await cartService.removeFromCart(productId);
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to remove item',
      );
    }
  },
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const guestItems = loadGuestCart();
const { totalCount, totalAmount } = computeTotals(guestItems);

const initialState = {
  items: guestItems,
  totalAmount,
  totalCount,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
      state.totalCount = 0;
      clearGuestCart();
    },
    clearCartError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const applyCartPayload = (state, items) => {
      state.items = items;
      const { totalCount: tc, totalAmount: ta } = computeTotals(items);
      state.totalCount = tc;
      state.totalAmount = ta;
    };

    // ---- fetchCart ----
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, { payload }) => {
        state.loading = false;
        applyCartPayload(state, payload.items || payload.cart?.items || []);
      })
      .addCase(fetchCart.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ---- addItemToCart ----
    builder
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, { payload }) => {
        state.loading = false;
        applyCartPayload(state, payload.items || payload.cart?.items || []);
      })
      .addCase(addItemToCart.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ---- updateCartItemQty ----
    builder
      .addCase(updateCartItemQty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQty.fulfilled, (state, { payload }) => {
        state.loading = false;
        applyCartPayload(state, payload.items || payload.cart?.items || []);
      })
      .addCase(updateCartItemQty.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ---- removeCartItem ----
    builder
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, { payload }) => {
        state.loading = false;
        applyCartPayload(state, payload.items || payload.cart?.items || []);
      })
      .addCase(removeCartItem.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearCart, clearCartError } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.totalCount;
export const selectCartTotal = (state) => state.cart.totalAmount;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

export default cartSlice.reducer;

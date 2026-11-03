import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import cartService from "../../services/cartService";

// ---------------------------------------------------------------------------
// Helpers - Guest cart in localStorage
// ---------------------------------------------------------------------------
const GUEST_KEY = "guest_cart";

const loadGuestCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.items)
        ? parsed.items
        : Array.isArray(parsed?.cart?.items)
          ? parsed.cart.items
          : [];
  } catch {
    return [];
  }
};

const saveGuestCart = (items) => {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors
  }
};

const clearGuestCart = () => {
  localStorage.removeItem(GUEST_KEY);
};

// ---------------------------------------------------------------------------
// Normalize API responses
// ---------------------------------------------------------------------------
const normalizeCartItems = (data) => {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.items)) return data.items;

  if (Array.isArray(data?.cart?.items)) {
    return data.cart.items;
  }

  if (Array.isArray(data?.data?.items)) {
    return data.data.items;
  }

  return [];
};

// ---------------------------------------------------------------------------
// Calculate cart totals
// ---------------------------------------------------------------------------
const computeTotals = (items = []) => {
  if (!Array.isArray(items)) {
    items = [];
  }

  const totalCount = items.reduce(
    (sum, item) => sum + Number(item.quantity || 1),
    0,
  );

  const totalAmount = items.reduce((sum, item) => {
    const price = Number(item.product?.price ?? item.price ?? 0);

    const quantity = Number(item.quantity || 1);

    return sum + price * quantity;
  }, 0);

  return {
    totalCount,
    totalAmount,
  };
};

// ---------------------------------------------------------------------------
// Async Thunks
// ---------------------------------------------------------------------------
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();

    if (!auth.isAuthenticated) {
      return { items: loadGuestCart(), guest: true };
    }

    try {
      return await cartService.getCart();
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to fetch cart",
      );
    }
  },
);

export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async (item, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const productId = item.productId || item._id;
    if (!productId) {
      return rejectWithValue("A valid product is required for the cart.");
    }

    if (!auth.isAuthenticated) {
      const items = loadGuestCart();

      const idx = items.findIndex(
        (i) =>
          i.productId === productId &&
          i.size === item.size &&
          i.color === item.color,
      );

      if (idx >= 0) {
        items[idx].quantity = (items[idx].quantity || 1) + (item.quantity || 1);
      } else {
        items.push({
          productId,
          name: item.name,
          price: item.price,
          image: item.image,
          size: item.size,
          color: item.color,
          quantity: item.quantity || 1,
        });
      }

      saveGuestCart(items);

      return { items, guest: true };
    }

    try {
      return await cartService.addToCart(productId, item.quantity || 1);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to add to cart",
      );
    }
  },
);

export const updateCartItemQty = createAsyncThunk(
  "cart/updateCartItemQty",
  async (
    { productId, itemId, quantity, size, color },
    { getState, rejectWithValue },
  ) => {
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

      return { items, guest: true };
    }

    const targetId = productId || itemId;
    try {
      return await cartService.updateQuantity(targetId, quantity);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to update cart",
      );
    }
  },
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (item, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const productId =
      typeof item === "string"
        ? item
        : item.productId || item.product?._id || item._id;
    const { size, color } = typeof item === "string" ? {} : item;

    if (!auth.isAuthenticated) {
      const items = loadGuestCart().filter(
        (i) =>
          !(
            i.productId === productId &&
            (!size || i.size === size) &&
            (!color || i.color === color)
          ),
      );

      saveGuestCart(items);

      return { items, guest: true };
    }

    try {
      return await cartService.removeFromCart(productId);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || "Failed to remove item",
      );
    }
  },
);

// ---------------------------------------------------------------------------
// Initial State
// ---------------------------------------------------------------------------
const guestItems = loadGuestCart();

const initialState = {
  items: guestItems,
  ...computeTotals(guestItems),
  loading: false,
  error: null,
};

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const cartSlice = createSlice({
  name: "cart",
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
    // Apply normalized cart response
    const applyCartPayload = (state, payload) => {
      const items = normalizeCartItems(payload);

      state.items = items;

      const totals = computeTotals(items);

      state.totalCount = totals.totalCount;
      state.totalAmount = totals.totalAmount;

      if (payload.guest) saveGuestCart(items);
    };

    // Fetch Cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, { payload }) => {
        state.loading = false;
        applyCartPayload(state, payload);
      })
      .addCase(fetchCart.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // Add Item
    builder
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, { payload }) => {
        state.loading = false;
        applyCartPayload(state, payload);
      })
      .addCase(addItemToCart.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // Update Quantity
    builder
      .addCase(updateCartItemQty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQty.fulfilled, (state, { payload }) => {
        state.loading = false;
        applyCartPayload(state, payload);
      })
      .addCase(updateCartItemQty.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // Remove Item
    builder
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, { payload }) => {
        state.loading = false;
        applyCartPayload(state, payload);
      })
      .addCase(removeCartItem.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------
export const { clearCart, clearCartError } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.totalCount;
export const selectCartTotal = (state) => state.cart.totalAmount;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

export default cartSlice.reducer;

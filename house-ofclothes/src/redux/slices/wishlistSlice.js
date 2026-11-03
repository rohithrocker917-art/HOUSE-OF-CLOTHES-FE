import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import wishlistService from '../../services/wishlistService';

// ---------------------------------------------------------------------------
// Helpers – guest wishlist in localStorage
// ---------------------------------------------------------------------------
const GUEST_KEY = 'guest_wishlist';

const loadGuestWishlist = () => {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGuestWishlist = (products) => {
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(products));
  } catch {
    /* ignore quota errors */
  }
};

const clearGuestWishlist = () => localStorage.removeItem(GUEST_KEY);

// ---------------------------------------------------------------------------
// Async thunks
// ---------------------------------------------------------------------------
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    if (!auth.isAuthenticated) {
      return { products: loadGuestWishlist() };
    }
    try {
      const data = await wishlistService.getWishlist();
      return data; // { products, ... }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch wishlist',
      );
    }
  },
);

export const toggleWishlistItem = createAsyncThunk(
  'wishlist/toggleWishlistItem',
  async (product, { getState, rejectWithValue }) => {
    const { auth, wishlist } = getState();
    const productId = product._id || product.productId || product.id;

    if (!auth.isAuthenticated) {
      // Guest wishlist toggle
      let items = loadGuestWishlist();
      const exists = items.some(
        (p) => (p._id || p.productId || p.id) === productId,
      );
      if (exists) {
        items = items.filter(
          (p) => (p._id || p.productId || p.id) !== productId,
        );
      } else {
        items.push(product);
      }
      saveGuestWishlist(items);
      return { products: items, toggled: productId, added: !exists };
    }

    try {
      // Determine add or remove
      const exists = wishlist.products.some(
        (p) => (p._id || p.productId || p.id) === productId,
      );
      let data;
      if (exists) {
        data = await wishlistService.removeFromWishlist(productId);
      } else {
        data = await wishlistService.addToWishlist(productId);
      }
      return { ...data, toggled: productId, added: !exists };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Wishlist toggle failed',
      );
    }
  },
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const guestProducts = loadGuestWishlist();

const initialState = {
  products: guestProducts,
  count: guestProducts.length,
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist(state) {
      state.products = [];
      state.count = 0;
      clearGuestWishlist();
    },
    clearWishlistError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ---- fetchWishlist ----
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.products = payload.products || payload.wishlist?.products || [];
        state.count = state.products.length;
      })
      .addCase(fetchWishlist.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ---- toggleWishlistItem ----
    builder
      .addCase(toggleWishlistItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleWishlistItem.fulfilled, (state, { payload }) => {
        state.loading = false;
        if (payload.products) {
          state.products = payload.products;
        } else if (payload.wishlist?.products) {
          state.products = payload.wishlist.products;
        }
        state.count = state.products.length;
      })
      .addCase(toggleWishlistItem.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { clearWishlist, clearWishlistError } = wishlistSlice.actions;

// Selectors
export const selectWishlistProducts = (state) => state.wishlist.products;
export const selectWishlistCount = (state) => state.wishlist.count;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectIsInWishlist = (productId) => (state) =>
  state.wishlist.products.some(
    (p) => (p._id || p.productId || p.id) === productId,
  );

export default wishlistSlice.reducer;

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

const normalizeWishlistProducts = (payload) =>
  payload?.products ||
  payload?.wishlist?.products ||
  payload?.data?.products ||
  [];

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
      return { ...data, products: normalizeWishlistProducts(data) };
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
    const item = typeof product === 'string' ? { _id: product } : product;
    const productId =
      item?._id || item?.productId || item?.id || item?.product?._id;
    if (!productId) {
      return rejectWithValue('A valid product is required for the wishlist.');
    }

    if (!auth.isAuthenticated) {
      // Guest wishlist toggle
      let items = loadGuestWishlist();
      const exists = items.some(
        (p) => String(p?._id || p?.productId || p?.id) === String(productId),
      );
      if (exists) {
        items = items.filter(
          (p) => String(p?._id || p?.productId || p?.id) !== String(productId),
        );
      } else {
        items.push(item);
      }
      saveGuestWishlist(items);
      return { products: items, toggled: productId, added: !exists };
    }

    try {
      const currentProducts = wishlist.loaded
        ? wishlist.products
        : normalizeWishlistProducts(await wishlistService.getWishlist());
      const exists = currentProducts.some(
        (p) =>
          String(p?._id || p?.productId || p?.id || p?.product?._id) ===
          String(productId),
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
  loaded: false,
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
        state.products =
          normalizeWishlistProducts(payload);
        state.count = state.products.length;
        state.loaded = true;
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
        } else if (payload.data?.products) {
          state.products = payload.data.products;
        }
        state.count = state.products.length;
        state.loaded = true;
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

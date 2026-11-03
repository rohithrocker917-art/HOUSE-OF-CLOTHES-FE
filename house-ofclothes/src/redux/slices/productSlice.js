import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

// ---------------------------------------------------------------------------
// Async thunks
// ---------------------------------------------------------------------------
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params, { rejectWithValue }) => {
    try {
      const data = await productService.getProducts(params);
      return data; // { products, totalPages, currentPage, ... }
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch products',
      );
    }
  },
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await productService.getProductById(id);
      return data; // product object
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Product not found',
      );
    }
  },
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const data = await productService.getCategories();
      return data; // categories[]
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to fetch categories',
      );
    }
  },
);

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const initialState = {
  products: [],
  currentProduct: null,
  categories: [],
  totalPages: 1,
  currentPage: 1,
  totalProducts: 0,
  loading: false,
  error: null,
  productsRequestId: null,
  filters: {
    category: '',
    sort: '',
    search: '',
    page: 1,
    limit: 12,
    minPrice: '',
    maxPrice: '',
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters(state, { payload }) {
      state.filters = { ...state.filters, ...payload };
    },
    clearFilters(state) {
      state.filters = { ...initialState.filters };
    },
    clearCurrentProduct(state) {
      state.currentProduct = null;
    },
    clearProductError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ---- fetchProducts ----
    builder
      .addCase(fetchProducts.pending, (state, { meta }) => {
        state.loading = true;
        state.error = null;
        state.productsRequestId = meta.requestId;
      })
      .addCase(fetchProducts.fulfilled, (state, { payload, meta }) => {
        if (state.productsRequestId !== meta.requestId) return;
        state.loading = false;
        state.productsRequestId = null;
        const fetchedProducts = payload.products || payload.data || [];
        state.products =
          Number(meta.arg?.page) > 1
            ? [...state.products, ...fetchedProducts]
            : fetchedProducts;
        state.totalPages =
          payload.totalPages || payload.pagination?.totalPages || 1;
        state.currentPage =
          payload.currentPage || payload.pagination?.page || payload.page || 1;
        state.totalProducts =
          payload.totalProducts ||
          payload.total ||
          payload.pagination?.total ||
          state.products.length;
      })
      .addCase(fetchProducts.rejected, (state, { payload, meta }) => {
        if (state.productsRequestId !== meta.requestId) return;
        state.loading = false;
        state.productsRequestId = null;
        state.error = payload;
      });

    // ---- fetchProductById ----
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.currentProduct = payload.product || payload;
      })
      .addCase(fetchProductById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });

    // ---- fetchCategories ----
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.categories = payload.categories || payload || [];
      })
      .addCase(fetchCategories.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { setFilters, clearFilters, clearCurrentProduct, clearProductError } =
  productSlice.actions;

// Selectors
export const selectProducts = (state) => state.products.products;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectCategories = (state) => state.products.categories;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
export const selectFilters = (state) => state.products.filters;
export const selectTotalPages = (state) => state.products.totalPages;
export const selectCurrentPage = (state) => state.products.currentPage;
export const selectTotalProducts = (state) => state.products.totalProducts;

export default productSlice.reducer;

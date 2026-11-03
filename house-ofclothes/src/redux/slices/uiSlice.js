import { createSlice } from '@reduxjs/toolkit';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const THEME_KEY = 'hoc_theme';

const loadTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    // Respect OS preference when no stored value
    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  } catch {
    return 'light';
  }
};

const applyThemeToDOM = (theme) => {
  try {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* SSR guard */
  }
};

// Apply theme on load
const currentTheme = loadTheme();
applyThemeToDOM(currentTheme);

let toastIdCounter = 0;

// ---------------------------------------------------------------------------
// Slice
// ---------------------------------------------------------------------------
const initialState = {
  theme: currentTheme,
  sidebarOpen: false,
  toasts: [], // { id, type: 'success'|'error'|'info'|'warning', message }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      applyThemeToDOM(state.theme);
    },
    setTheme(state, { payload }) {
      state.theme = payload;
      applyThemeToDOM(state.theme);
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
    addToast(state, { payload }) {
      toastIdCounter += 1;
      state.toasts.push({
        id: payload.id || toastIdCounter,
        type: payload.type || 'info',
        message: payload.message,
      });
    },
    removeToast(state, { payload: id }) {
      state.toasts = state.toasts.filter((t) => t.id !== id);
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  closeSidebar,
  addToast,
  removeToast,
} = uiSlice.actions;

// Selectors
export const selectTheme = (state) => state.ui.theme;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectToasts = (state) => state.ui.toasts;

export default uiSlice.reducer;

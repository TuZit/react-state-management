import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { postsApi } from "./postsApi";

export const store = configureStore({
  reducer: {
    // Thêm API service vào store
    [postsApi.reducerPath]: postsApi.reducer,
  },
  // Thêm middleware của API để enable caching, invalidation, polling, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postsApi.middleware),
});

// Tùy chọn, nhưng cần thiết cho các hành vi refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

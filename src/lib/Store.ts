import { ImageSlice } from "@/app/features/ImageSlice";
import { OrderApi } from "@/app/features/OrderSlice";
import { PlantApi } from "@/app/features/Planted";
import { ProductApi } from "@/app/features/ProductAdd";
import { UserApi } from "@/app/features/users";
import { BannerApi } from "@/app/features/BannerSlice";
import { BlogApi } from "@/app/features/BlogSlice";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [OrderApi.reducerPath]: OrderApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [PlantApi.reducerPath]: PlantApi.reducer,
    [ProductApi.reducerPath]: ProductApi.reducer,
    [BannerApi.reducerPath]: BannerApi.reducer,
    [BlogApi.reducerPath]: BlogApi.reducer,
    Image: ImageSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      OrderApi.middleware,
      UserApi.middleware,
      PlantApi.middleware,
      ProductApi.middleware,
      BannerApi.middleware,
      BlogApi.middleware
    ),
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

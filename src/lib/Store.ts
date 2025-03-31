import { OrderApi } from "@/app/features/OrderSlice";
import { PlantApi } from "@/app/features/Planted";
import { UserApi } from "@/app/features/users";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [OrderApi.reducerPath]: OrderApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
    [PlantApi.reducerPath]: PlantApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      OrderApi.middleware,
      UserApi.middleware,
      PlantApi.middleware
    ),
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

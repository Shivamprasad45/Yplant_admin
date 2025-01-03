import { OrderApi } from "@/app/features/OrderSlice";
import { UserApi } from "@/app/features/users";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [OrderApi.reducerPath]: OrderApi.reducer,
    [UserApi.reducerPath]: UserApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(OrderApi.middleware, UserApi.middleware),
});
setupListeners(store.dispatch);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

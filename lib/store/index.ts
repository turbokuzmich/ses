import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, useStore } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { meApi } from "./slices/me";
import { postsApi } from "./slices/posts";
import { musicApi } from "./slices/music";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      [meApi.reducerPath]: meApi.reducer,
      [postsApi.reducerPath]: postsApi.reducer,
      [musicApi.reducerPath]: musicApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        meApi.middleware,
        postsApi.middleware,
        musicApi.middleware
      ),
  });

  setupListeners(store.dispatch);

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

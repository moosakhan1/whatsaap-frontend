import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/auth/auth";
import selectChatSlice from "../redux/features/chats/chat";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import setActiveCallSlice from "./features/activecall/activecall";
const persistConfig = {
  key: "root", // The key used in localStorage
  storage, // Storage type (localStorage or sessionStorage)
};

const rootReducer = combineReducers({
  auth: authReducer, // Replace 'user' with your actual slice name
  selectChat: selectChatSlice,
  activeCall: setActiveCallSlice,
});
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist to work correctly
    }),
});
export const persistor = persistStore(store);

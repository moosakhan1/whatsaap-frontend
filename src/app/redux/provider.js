"use client";
import { Provider } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { SocketProvider } from "../context/socketContext";
import { PeerProvider } from "../context/peerContext";
export default function StoreProvider({ children }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SocketProvider>
          <PeerProvider>{children}</PeerProvider>
        </SocketProvider>
      </PersistGate>
    </Provider>
  );
}

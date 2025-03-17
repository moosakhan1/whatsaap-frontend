import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext({
  // socket: false,
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  // const { selectedChat } = useSelector((state) => state.selectChat);

  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    const token = user?.token;
    const query = { query: token ? { token } : {} };
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL, { ...query });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);

  const listenersRef = useRef({});

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = io("http://127.0.0.1:5000", {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket Connected");
      setConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket Disconnected");
      setConnected(false);
    });

    socket.on("connection_ack", (data) => {
      console.log("Server:", data);
    });

    return () => {
      Object.keys(listenersRef.current).forEach((event) => {
        listenersRef.current[event].forEach((callback) => {
          socket.off(event, callback);
        });
      });

      socket.disconnect();
    };
  }, []);

  const subscribe = (event, callback) => {
    if (!socketRef.current) return;

    socketRef.current.on(event, callback);

    if (!listenersRef.current[event]) {
      listenersRef.current[event] = [];
    }

    listenersRef.current[event].push(callback);
  };

  const unsubscribe = (event, callback) => {
    if (!socketRef.current) return;

    if (callback) {
      socketRef.current.off(event, callback);

      if (listenersRef.current[event]) {
        listenersRef.current[event] =
          listenersRef.current[event].filter(
            (cb) => cb !== callback
          );
      }
    } else {
      socketRef.current.removeAllListeners(event);
      listenersRef.current[event] = [];
    }
  };

  const emit = (event, data) => {
    if (!socketRef.current) return;

    socketRef.current.emit(event, data);
  };

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        connected,
        subscribe,
        unsubscribe,
        emit,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);

  if (!context) {
    throw new Error(
      "useSocket must be used inside SocketProvider."
    );
  }

  return context;
};

export default SocketContext;
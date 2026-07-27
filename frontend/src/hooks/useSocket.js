import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export const useSocket = (url = 'http://localhost:5000') => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    // Initialize socket connection
    const socket = io(url, {
      transports: ['websocket'],
      auth: { token }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      console.log('[Socket] Connected to NIDS service stream.');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('[Socket] Disconnected from NIDS service.');
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [url, token]);

  const subscribe = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const unsubscribe = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  return {
    connected,
    subscribe,
    unsubscribe,
    emit
  };
};
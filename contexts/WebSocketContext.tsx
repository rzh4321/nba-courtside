"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";

interface WebSocketContextType {
  sendMessage: (message: any) => void;
  lastMessage: any;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const sockjs = useRef<any>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const connect = () => {
    try {
      // Close existing connection if any
      if (sockjs.current) {
        sockjs.current.close();
      }

      const wsUrl =
        process.env.NEXT_PUBLIC_WS_URL || "http://localhost:8080/ws/odds";
      sockjs.current = new SockJS(wsUrl);

      sockjs.current.onopen = () => {
        console.log("Connected to WebSocket");
        setIsConnected(true);
      };

      sockjs.current.onclose = (event: any) => {
        console.log(
          "WebSocket closed with code:",
          event.code,
          "reason:",
          event.reason,
        );
        setIsConnected(false);
        // Reconnect after 3 seconds
        reconnectTimeout.current = setTimeout(connect, 3000);
      };

      sockjs.current.onmessage = (event: { data: string }) => {
        try {
          const message = JSON.parse(event.data);
          setLastMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      sockjs.current.onerror = (error: any) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Error creating WebSocket connection:", error);
    }
  };

  useEffect(() => {
    connect();
    return () => {
      if (sockjs.current) {
        sockjs.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, []);

  const sendMessage = (message: any) => {
    if (sockjs.current && sockjs.current.readyState === SockJS.OPEN) {
      try {
        sockjs.current.send(JSON.stringify(message));
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.warn("WebSocket is not connected. Message not sent.");
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ sendMessage, lastMessage, isConnected }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

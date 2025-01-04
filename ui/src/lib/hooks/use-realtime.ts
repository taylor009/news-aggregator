"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";

interface Article {
  id: number;
  title: string;
  content: string;
  url: string;
  imageUrl?: string;
  source: string;
  author?: string;
  categories: string[];
  createdAt: string;
}

export function useRealtime() {
  const [newArticles, setNewArticles] = useState<Article[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_INTERVAL = 5000;

  const connect = useCallback(() => {
    try {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      wsRef.current = new WebSocket("ws://localhost:8080/articles");

      wsRef.current.onopen = () => {
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        console.log("WebSocket connected");
      };

      wsRef.current.onmessage = (event) => {
        try {
          const article = JSON.parse(event.data);
          setNewArticles((prev) => [article, ...prev]);
          toast.success("New article available!", {
            duration: 4000,
            position: "bottom-right",
          });
        } catch (error) {
          console.warn("Failed to parse WebSocket message:", error);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        console.log("WebSocket disconnected");

        // Attempt to reconnect if we haven't exceeded the maximum attempts
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnect attempt ${reconnectAttemptsRef.current}`);
            connect();
          }, RECONNECT_INTERVAL);
        } else {
          toast.error(
            "Connection lost. Please refresh the page to reconnect.",
            {
              duration: 5000,
            }
          );
        }
      };

      wsRef.current.onerror = () => {
        console.warn("WebSocket connection error");
        wsRef.current?.close();
      };
    } catch (error) {
      console.warn("Failed to establish WebSocket connection:", error);
    }
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);

  const clearNewArticles = useCallback(() => {
    setNewArticles([]);
  }, []);

  return {
    newArticles,
    isConnected,
    clearNewArticles,
  };
}

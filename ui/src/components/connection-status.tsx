"use client";

import { Wifi, WifiOff } from "lucide-react";

interface ConnectionStatusProps {
  isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium shadow-lg transition-colors ${
        isConnected
          ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
          : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
      }`}
    >
      {isConnected ? (
        <>
          <Wifi className="h-4 w-4" />
          <span>Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4" />
          <span>Disconnected</span>
        </>
      )}
    </div>
  );
}

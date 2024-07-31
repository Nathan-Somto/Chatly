import useSocketStore from "@/hooks/useSocket";
import React, { useEffect, useState } from "react";

export default function ConnectionStatus() {
  const [show, setShow] = useState(true);
  const { isConnected } = useSocketStore();
  // set a timer to remove it after a while
  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 7000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  if (!show) return null;
  return (
    <header className="bg-gray-50 dark:bg-background border-b top-0 fixed h-7 px-2 w-full z-[9999999999] border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 h-full">
        <div
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <p className="text-xs text-gray-700 dark:text-gray-300">
          {isConnected ? "Connected" : "Disconnected"}
        </p>
      </div>
    </header>
  );
}

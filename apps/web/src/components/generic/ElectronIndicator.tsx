"use client";

import { useEffect, useState } from "react";

export function ElectronIndicator() {
  const [isElectron, setIsElectron] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && /Electron/.test(navigator.userAgent)) {
      setIsElectron(true);
    } else {
      setIsElectron(false);
    }
  }, []);

  if (process.env.NODE_ENV === "production") return null;
  return (
    <div className="fixed bottom-0 left-1 z-50 flex items-center space-x-2 rounded-full bg-black px-2.5 py-1 font-mono text-xs font-medium text-white">
      {isElectron ? "Yes" : "No"}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

export default function WebViewErrorAlert() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = window.setTimeout(() => {
      setShouldShow(!window.Telegram?.WebApp);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  if (!shouldShow) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-white/95 px-4 py-3 text-sm text-black backdrop-blur"
    >
      Telegram WebApp topilmadi. Ilovani Telegram ichida oching.
    </div>
  );
}

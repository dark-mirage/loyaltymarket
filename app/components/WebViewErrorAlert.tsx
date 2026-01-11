"use client";

import { useEffect, useRef } from "react";

function formatUnknown(value: unknown): string {
  if (value instanceof Error) {
    return value.stack || value.message || String(value);
  }

  if (typeof value === "string") return value;

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function canDebugErrors(): boolean {
  if (typeof window === "undefined") return false;

  const isTelegram = Boolean(window.Telegram?.WebApp);
  const params = new URLSearchParams(window.location.search);
  const forced = params.get("debugErrors") === "1";

  return isTelegram || forced;
}

export default function WebViewErrorAlert() {
  const didReportRef = useRef(false);

  useEffect(() => {
    if (!canDebugErrors()) return;

    const tg = window.Telegram?.WebApp ?? null;

    const notify = (text: string) => {
      if (didReportRef.current) return;
      didReportRef.current = true;

      try {
        // Telegram WebApp has a nicer alert
        if (tg?.showAlert) {
          tg.showAlert(text);
          return;
        }
      } catch {
        // ignore
      }

      try {
        window.alert(text);
      } catch {
        // ignore
      }
    };

    const onError = (event: ErrorEvent) => {
      const message = event.message || "Unknown error";
      const location = event.filename
        ? `${event.filename}:${event.lineno ?? "?"}:${event.colno ?? "?"}`
        : "";
      const stack = event.error instanceof Error ? event.error.stack : "";

      notify(
        [
          "WebView error:",
          message,
          location,
          stack || "",
          "\nTip: add ?debugErrors=1 to force alerts in non-Telegram browser.",
        ]
          .filter(Boolean)
          .join("\n")
      );
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      notify(
        [
          "Unhandled promise rejection:",
          formatUnknown(event.reason),
          "\nTip: add ?debugErrors=1 to force alerts in non-Telegram browser.",
        ]
          .filter(Boolean)
          .join("\n")
      );
    };

    // Optional: also surface console.error (React hydration errors often go here)
    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      originalConsoleError(...args);
      try {
        const text = args.map(formatUnknown).join(" ");
        if (text) notify(`console.error: ${text}`);
      } catch {
        // ignore
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      console.error = originalConsoleError;
    };
  }, []);

  return null;
}

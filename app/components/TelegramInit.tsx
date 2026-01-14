"use client";

import { useEffect } from "react";

type Insets = { top: number; bottom: number; left: number; right: number };

function setCssVarPx(name: string, value: number | undefined | null) {
  if (typeof document === "undefined") return;
  const safeValue =
    typeof value === "number" && Number.isFinite(value) ? value : 0;
  document.documentElement.style.setProperty(
    name,
    `${Math.max(0, safeValue)}px`
  );
}

function setCssVar(name: string, value: string) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty(name, value);
}

function applyThemeColors(tg: TelegramWebAppLike) {
  const bg = tg.themeParams?.bg_color ?? "#ffffff";

  // Visually blend Telegram header with your app background.
  // The header itself cannot be removed, but matching colors makes it seamless.
  try {
    tg.setBackgroundColor(bg);
    tg.setHeaderColor(bg);
  } catch {
    // ignore (older clients)
  }

  if (typeof document !== "undefined") {
    document.documentElement.style.backgroundColor = bg;
    document.body.style.backgroundColor = bg;
  }
}

function syncViewportVars(tg: TelegramWebAppLike) {
  // Telegram's viewportHeight is the correct height inside the WebView.
  // Do NOT use 100vh for layout because mobile browser UI and Telegram chrome shift it.
  const vh =
    tg.viewportHeight ||
    (typeof window !== "undefined" ? window.innerHeight : 0);
  const stable = tg.viewportStableHeight || vh;
  setCssVarPx("--tg-viewport-height", vh);
  setCssVarPx("--tg-viewport-stable-height", stable);
  setCssVar("--tg-is-expanded", tg.isExpanded ? "1" : "0");

  const safe = tg.safeAreaInset;
  if (safe) {
    setCssVarPx("--tg-safe-area-top", safe.top);
    setCssVarPx("--tg-safe-area-bottom", safe.bottom);
    setCssVarPx("--tg-safe-area-left", safe.left);
    setCssVarPx("--tg-safe-area-right", safe.right);
  }

  const contentSafe = tg.contentSafeAreaInset;
  if (contentSafe) {
    setCssVarPx("--tg-content-safe-area-top", contentSafe.top);
    setCssVarPx("--tg-content-safe-area-bottom", contentSafe.bottom);
    setCssVarPx("--tg-content-safe-area-left", contentSafe.left);
    setCssVarPx("--tg-content-safe-area-right", contentSafe.right);
  }
}

function compareSemver(a: string, b: string) {
  const pa = a.split(".").map((x) => Number.parseInt(x, 10));
  const pb = b.split(".").map((x) => Number.parseInt(x, 10));
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const ai = Number.isFinite(pa[i]) ? (pa[i] as number) : 0;
    const bi = Number.isFinite(pb[i]) ? (pb[i] as number) : 0;
    if (ai !== bi) return ai - bi;
  }
  return 0;
}

function requestFullscreenBestEffort(tg: TelegramWebAppLike) {
  // Telegram clients vary by platform/version: method name may differ or be missing.
  // This is best-effort; failure is expected on some clients (and should be ignored).
  // Some older clients expose the method but log/throw "not supported".
  const minSupported = "7.0";
  if (
    typeof tg.version === "string" &&
    compareSemver(tg.version, minSupported) < 0
  ) {
    return;
  }
  const request = tg.requestFullscreen ?? tg.requestFullScreen;
  if (typeof request !== "function") return;
  try {
    request.call(tg);
  } catch {
    // ignore
  }
}

type TelegramWebAppLike = {
  version?: string;
  ready: () => void;
  expand: () => void;
  requestFullscreen?: () => void;
  requestFullScreen?: () => void;
  onEvent: (eventType: string, eventHandler: () => void) => void;
  offEvent: (eventType: string, eventHandler: () => void) => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  viewportHeight: number;
  viewportStableHeight: number;
  isExpanded: boolean;
  themeParams?: { bg_color?: string };
  safeAreaInset?: Insets;
  contentSafeAreaInset?: Insets;
};

function getTelegramWebApp(): TelegramWebAppLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { Telegram?: { WebApp?: TelegramWebAppLike } };
  return w.Telegram?.WebApp ?? null;
}

/**
 * Telegram WebApp initializer.
 * - Calls Telegram.WebApp.ready()
 * - Calls Telegram.WebApp.expand() to request max height
 * - Mirrors Telegram.WebApp.viewportHeight into CSS vars for correct sizing
 */
export default function TelegramInit() {
  useEffect(() => {
    let isCancelled = false;

    const attach = (tg: TelegramWebAppLike) => {
      if (isCancelled) return;

      tg.ready();
      tg.expand();
      requestFullscreenBestEffort(tg);

      applyThemeColors(tg);
      syncViewportVars(tg);

      const onViewport = () => {
        // Telegram may update viewportHeight asynchronously.
        // Using rAF keeps layout in sync with the final value.
        requestAnimationFrame(() => syncViewportVars(tg));
      };

      const onTheme = () => applyThemeColors(tg);

      tg.onEvent("viewportChanged", onViewport);
      tg.onEvent("themeChanged", onTheme);
      window.addEventListener("resize", onViewport, { passive: true });

      // A second expand after first paint helps on some Android clients.
      window.setTimeout(() => {
        try {
          tg.expand();
          requestFullscreenBestEffort(tg);
          onViewport();
        } catch {
          // ignore
        }
      }, 50);

      return () => {
        tg.offEvent("viewportChanged", onViewport);
        tg.offEvent("themeChanged", onTheme);
        window.removeEventListener("resize", onViewport);
      };
    };

    // SDK can be present slightly after hydration; wait a bit.
    let cleanup: (() => void) | undefined;
    const startedAt = Date.now();

    const tryInit = () => {
      if (isCancelled) return;
      const tg = getTelegramWebApp();
      if (tg) {
        cleanup = attach(tg);
        return;
      }
      if (Date.now() - startedAt < 2000) {
        requestAnimationFrame(tryInit);
      }
    };

    tryInit();

    return () => {
      isCancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}

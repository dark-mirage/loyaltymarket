"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CART_STORAGE_KEY = "loyaltymarket_cart_v1";
const CART_UPDATED_EVENT = "loyaltymarket_cart_updated";

function getCartTotalQuantityFromStorage() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return 0;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return 0;

    return parsed.reduce((sum, entry) => {
      const x: Record<string, unknown> =
        typeof entry === "object" && entry !== null
          ? (entry as Record<string, unknown>)
          : {};
      const q = typeof x.quantity === "number" ? x.quantity : 0;
      return sum + Math.max(0, q);
    }, 0);
  } catch {
    return 0;
  }
}

const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const refresh = () => setCartCount(getCartTotalQuantityFromStorage());
    refresh();

    window.addEventListener("storage", refresh);
    window.addEventListener(CART_UPDATED_EVENT, refresh);
    document.addEventListener("visibilitychange", refresh);

    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener(CART_UPDATED_EVENT, refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const badgeText = cartCount > 99 ? "99+" : String(cartCount);
  const activeTab =
    pathname === "/"
      ? "home"
      : pathname.startsWith("/poizon")
      ? "poizon"
      : pathname.startsWith("/catalog")
      ? "catalog"
      : pathname.startsWith("/favorites")
      ? "heart"
      : pathname.startsWith("/trash")
      ? "trash"
      : pathname.startsWith("/profile")
      ? "user"
      : "";

  // Базовый путь к иконкам — поправьте здесь, если иконки лежат не в public/icons/footer
  const ICONS_PATH = "/icons/footer";
  const HomeIcon = "/icons/footer/home.svg";

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="flex py-2 justify-center">
        <Link href="/">
          <button className="flex flex-col items-center py-1 mr-[40px]">
            <img
              src={HomeIcon}
              alt="home"
              className={`w-6 h-6 ${
                activeTab === "home" ? "filter brightness-0" : "opacity-60"
              }`}
            />
          </button>
        </Link>

        <Link href="/poizon">
          <button className="flex flex-col items-center py-1  mr-[45px]">
            <img
              src={`${ICONS_PATH}/Poizon.svg`}
              alt="Poizon"
              className={`w-4 h-6 ${
                activeTab === "poizon" ? "filter brightness-0" : "opacity-60"
              }`}
            />
          </button>
        </Link>

        <Link href="/catalog">
          <button className="flex flex-col items-center py-1 pt-[6px] mr-[44px]">
            <img
              src={`${ICONS_PATH}/Search.svg`}
              style={{ width: "32px", height: "18px" }}
              alt="catalog"
              className={`w-6 h-6 ${
                activeTab === "catalog" ? "filter brightness-0" : "opacity-60"
              }`}
            />
          </button>
        </Link>

        <Link href="/favorites">
          <button className="flex flex-col items-center py-1 pt-[5px]  mr-[48px]">
            <img
              src={`${ICONS_PATH}/Heart.svg`}
              style={{ height: "20px" }}
              alt="heart"
              className={`w-5 h-6 ${
                activeTab === "heart" ? "filter brightness-0" : "opacity-60"
              }`}
            />
          </button>
        </Link>

        <Link href="/trash">
          <button className="flex flex-col items-center py-1 mr-[47px]">
            <span className="relative inline-flex">
              <img
                src={`${ICONS_PATH}/Trach.svg`}
                alt="trach"
                className={`w-5 h-6 ${
                  activeTab === "trash" ? "filter brightness-0" : "opacity-60"
                }`}
              />
              {cartCount > 0 ? (
                <span className="absolute -top-2 -right-3 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF601D] text-white text-[11px] font-semibold leading-[18px] text-center">
                  {badgeText}
                </span>
              ) : null}
            </span>
          </button>
        </Link>

        <Link href="/profile">
          <button className="flex flex-col items-center py-1">
            <img
              src={`${ICONS_PATH}/User.svg`}
              alt="user"
              className={`w-5 h-6 ${
                activeTab === "user" ? "filter brightness-0" : "opacity-60"
              }`}
            />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavigation;

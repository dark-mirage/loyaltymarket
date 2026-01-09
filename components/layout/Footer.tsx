"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BottomNavigation: React.FC = () => {
  const pathname = usePathname();
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
      <div className="flex py-2 pb-[40px] justify-center">
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
          <button className="flex flex-col items-center py-1  mr-[47px]">
            <img
              src={`${ICONS_PATH}/Trach.svg`}
              alt="trach"
              className={`w-5 h-6 ${
                activeTab === "trash" ? "filter brightness-0" : "opacity-60"
              }`}
            />
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

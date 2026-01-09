"use client";
import React from "react";
import { Product, ProductCardVariant } from "./types";

interface Props {
  product: Product;
  onToggleFavorite: (id: number) => void;
  variant?: ProductCardVariant;
  hideFavoriteButton?: boolean;
}

const ProductCard: React.FC<Props> = ({
  product,
  onToggleFavorite,
  variant = "normal",
  hideFavoriteButton = false,
}) => {
  const widthClass =
    variant === "compact" ? "w-full max-w-[143px]" : "w-full max-w-[180px]";
  const imageMbClass = variant === "compact" ? "mb-[15px]" : "mb-[5px]";

  return (
    <div className={`${widthClass} flex-shrink-0`}>
      <div
        className={`relative bg-gray-100 rounded-xl overflow-hidden ${imageMbClass}`}
        style={{ aspectRatio: "3/4" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          {typeof product.image === "string" &&
          /\.(png|jpe?g|svg|webp|avif)$/i.test(product.image) ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl bg-[var(--items-background)]"
            />
          ) : (
            <div className="text-4xl">{product.image}</div>
          )}
        </div>
        {!hideFavoriteButton ? (
          <button
            onClick={() => onToggleFavorite(product.id)}
            className="absolute top-[6px] right-[8px] w-[24px] h-[20px] rounded-full flex items-center justify-center"
            aria-pressed={product.isFavorite}
          >
            <img
              src={
                product.isFavorite
                  ? "/icons/global/active-heart.svg"
                  : "/icons/global/not-active-heart.svg"
              }
              alt={product.isFavorite ? "liked" : "not liked"}
              className="w-[23px] h-[23px] bg-[rgba(244,243,241,1)]"
            />
          </button>
        ) : (
          <button
            onClick={() => onToggleFavorite(product.id)}
            className="absolute top-[6px] right-[8px] w-[24px] h-[20px] rounded-full flex items-center justify-center"
            aria-label="Добавить в избранное"
          >
            <img
              src="/icons/global/not-active-heart.svg"
              alt="Добавить в избранное"
              className="w-[23px] h-[23px] bg-[rgba(244,243,241,1)]"
            />
          </button>
        )}
      </div>
      {variant === "normal" && (
        <img
          className="mb-[6px]"
          src="/icons/product/dots-mini-slider.svg"
          alt="dots"
        />
      )}

      <div className={variant === "compact" ? "pl-0" : "pl-[4px]"}>
        <div className="text-sm mb-[4px] text-[18px] leading-[100%] tracking-[-0.04em]">
          {product.price}
        </div>

        <div className="text-[12px] line-clamp-2 text-black font-inter font-normal text-[12px] leading-[120%] tracking-[0] mb-[7px]">
          {product.name}
        </div>
      </div>

      {/* Кнопка даты доставки */}
      {product.deliveryDate && (
        <button className="w-full h-[40px] bg-[#F4F3F1] rounded-2xl flex items-center justify-center mt-2">
          <span className="text-[13px] font-semibold leading-[1.06em] tracking-[0.02em] text-black">
            {product.deliveryDate}
          </span>
        </button>
      )}
    </div>
  );
};

export default ProductCard;

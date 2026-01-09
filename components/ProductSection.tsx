"use client";
import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "./types";

interface ProductSectionProps {
  title?: string;
  products: Product[];
  onToggleFavorite: (id: number) => void;
  layout?: "horizontal" | "grid"; // Меняем на horizontal для ручного скролла
  hideFavoriteButton?: boolean;
}

const ProductSection: React.FC<ProductSectionProps> = ({
  title,
  products,
  onToggleFavorite,
  layout = "grid",
  hideFavoriteButton = false,
}) => {
  if (layout === "horizontal") {
    return (
      <section>
        <div className="flex items-center justify-between mb-[15px] pr-[15px]">
          <h2 className="text-[20px] font-semibold">{title}</h2>
          <button className=" text-[#7E7E7E] flex items-center justify-center  font-medium">
            <span className="text-[15px]">все</span>
            <img
              className="w-[10px] h-[12px]"
              src="/icons/global/arrow.svg"
              alt="arrow"
            />
          </button>
        </div>
        <div className="relative">
          <div className="flex gap-[11px] overflow-x-auto pb-2 scrollbar-hide">
            {products?.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onToggleFavorite={onToggleFavorite}
                variant="compact"
                hideFavoriteButton={hideFavoriteButton}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-4 pt-[0] bg-white rounded-t-2xl">
      <div className="flex items-center justify-between mb-[12px]">
        <h2 className="text-[21px] font-semibold">{title}</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 gap-y-[20px]">
        {products?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onToggleFavorite={onToggleFavorite}
            variant="normal"
            hideFavoriteButton={hideFavoriteButton}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;

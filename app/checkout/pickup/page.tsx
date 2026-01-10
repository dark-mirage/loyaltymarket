"use client";

import React, { useEffect, useMemo, useState } from "react";

type PickupPoint = {
  id: string;
  title: string;
  subtitle: string;
};

type DaDataSuggestAddressResponse = {
  suggestions?: Array<{
    value?: string;
    data?: {
      region_with_type?: string;
      city_with_type?: string;
      settlement_with_type?: string;
      area_with_type?: string;
      country?: string;
    };
  }>;
};

export default function CheckoutPickupPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    NonNullable<DaDataSuggestAddressResponse["suggestions"]>
  >([]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      return;
    }

    const t = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/dadata/suggest/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q, count: 5 }),
        });

        if (!res.ok) {
          setSuggestions([]);
          return;
        }

        const data: unknown = await res.json();
        const s = (data as DaDataSuggestAddressResponse)?.suggestions;
        setSuggestions(Array.isArray(s) ? s : []);
      } catch {
        setSuggestions([]);
      }
    }, 250);

    return () => window.clearTimeout(t);
  }, [query]);

  const listItems = useMemo(() => {
    if (!query.trim()) return [];
    if (suggestions.length === 0) return [];

    return suggestions.map((x, index) => {
      const d = x.data;
      const subtitle =
        d?.region_with_type ||
        d?.city_with_type ||
        d?.settlement_with_type ||
        d?.area_with_type ||
        d?.country ||
        "";
      return {
        id: `dadata-${index}`,
        title: x.value || query,
        subtitle,
      } satisfies PickupPoint;
    });
  }, [query, suggestions]);

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="px-4 pt-4">
        <div className="mt-2 bg-[#F4F3F1] rounded-[16px] h-[44px] flex items-center gap-2 px-3">
          <img
            src="/icons/global/Search.svg"
            alt="search"
            className="w-[18px] h-[18px] opacity-60"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[14px] text-black placeholder:text-[#7E7E7E]"
            placeholder="Введите город"
          />
          {query.length > 0 ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="w-[28px] h-[28px] grid place-items-center"
              aria-label="Clear"
            >
              <img
                src="/icons/global/xicon.svg"
                alt="clear"
                className="w-[16px] h-[16px] opacity-60"
              />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-2">
        {listItems.map((p, idx) => (
          <div
            key={p.id}
            className={
              "px-4 py-4 flex items-start gap-3 " +
              (idx === listItems.length - 1 ? "" : "border-b border-[#E5E5E5]")
            }
          >
            <img
              src="/icons/global/location.svg"
              alt="location"
              className="w-5 h-5 mt-[2px]"
            />
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-black">
                {p.title}
              </div>
              <div className="text-[12px] text-[#7E7E7E]">{p.subtitle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

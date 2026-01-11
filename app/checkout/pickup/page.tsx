"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "leaflet/dist/leaflet.css";
import Button from "@/components/ui/Button";
import { useRouter, useSearchParams } from "next/navigation";

type DaDataSuggestAddressResponse = {
  suggestions?: Array<{
    value?: string;
    data?: {
      geo_lat?: string | null;
      geo_lon?: string | null;
      region_with_type?: string;
      city_with_type?: string;
      settlement_with_type?: string;
      area_with_type?: string;
      country?: string;
    };
  }>;
};

type SuggestItem = {
  id: string;
  title: string;
  subtitle: string;
  lat: number | null;
  lon: number | null;
};

type PvzProvider = "Яндекс Доставка" | "CDEK" | "Boxberry" | "Почта России";

type PvzPoint = {
  id: string;
  provider: PvzProvider;
  address: string;
  deliveryText: string;
  priceText: string;
  lat: number;
  lon: number;
};

type MapSelection = {
  title: string;
  subtitle: string;
  lat: number;
  lon: number;
};

const TEST_PVZ_POINTS: PvzPoint[] = [
  {
    id: "pvz-yandex-1",
    provider: "Яндекс Доставка",
    address: "Москва, Никольская ул, д. 17, стр. 2",
    deliveryText: "Доставка 2-5 дней",
    priceText: "Стоимость — 726₽",
    lat: 55.7577,
    lon: 37.6217,
  },
  {
    id: "pvz-cdek-1",
    provider: "CDEK",
    address: "Москва, Никольская ул, д. 17, стр. 2",
    deliveryText: "Доставка 2-5 дней",
    priceText: "Стоимость — 726₽",
    lat: 55.7584,
    lon: 37.6179,
  },
  {
    id: "pvz-boxberry-1",
    provider: "Boxberry",
    address: "Москва, Никольская ул, д. 17, стр. 2",
    deliveryText: "Доставка 2-5 дней",
    priceText: "Стоимость — 726₽",
    lat: 55.7509,
    lon: 37.6166,
  },
  {
    id: "pvz-post-1",
    provider: "Почта России",
    address: "Москва, Никольская ул, д. 17, стр. 2",
    deliveryText: "Доставка 2-5 дней",
    priceText: "Стоимость — 726₽",
    lat: 55.7512,
    lon: 37.6239,
  },
];

export default function CheckoutPickupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const userMarkerRef = useRef<
    import("leaflet").CircleMarker | import("leaflet").Marker | null
  >(null);
  const userAccuracyCircleRef = useRef<import("leaflet").Circle | null>(null);
  const geoWatchIdRef = useRef<number | null>(null);
  const userEverCenteredRef = useRef(false);
  const initSeqRef = useRef(0);
  const iconFixedRef = useRef(false);

  const initialStep = useMemo<"search" | "map" | "list">(() => {
    const step = searchParams.get("step");
    if (step === "map" || step === "list" || step === "search") return step;
    return "search";
  }, [searchParams]);

  const [step, setStep] = useState<"search" | "map" | "list">(initialStep);

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

  const [pvzQuery, setPvzQuery] = useState("");
  const [selection, setSelection] = useState<MapSelection | null>(null);

  const [isUserTracking, setIsUserTracking] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    NonNullable<DaDataSuggestAddressResponse["suggestions"]>
  >([]);

  useEffect(() => {
    const q = query.trim();
    if (!q) return;

    const t = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/dadata/suggest/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q, count: 10 }),
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

  const items = useMemo((): SuggestItem[] => {
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

      const latRaw = d?.geo_lat ?? null;
      const lonRaw = d?.geo_lon ?? null;
      const lat = latRaw == null ? null : Number(latRaw);
      const lon = lonRaw == null ? null : Number(lonRaw);

      return {
        id: `dadata-${index}`,
        title: x.value || query,
        subtitle,
        lat: Number.isFinite(lat) ? lat : null,
        lon: Number.isFinite(lon) ? lon : null,
      };
    });
  }, [query, suggestions]);

  const setStepAndUrl = (next: "search" | "map" | "list") => {
    setStep(next);
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", next);
    router.replace(`/checkout/pickup?${params.toString()}`);
  };

  const filteredPvz = useMemo(() => {
    const q = pvzQuery.trim().toLowerCase();
    if (!q) return TEST_PVZ_POINTS;

    return TEST_PVZ_POINTS.filter((x) => {
      const hay = `${x.provider} ${x.address}`.toLowerCase();
      return hay.includes(q);
    });
  }, [pvzQuery]);

  const stopUserTracking = useCallback(() => {
    if (geoWatchIdRef.current != null) {
      try {
        navigator.geolocation.clearWatch(geoWatchIdRef.current);
      } catch {
        // ignore
      }
      geoWatchIdRef.current = null;
    }

    try {
      userMarkerRef.current?.remove();
    } catch {
      // ignore
    }
    userMarkerRef.current = null;

    try {
      userAccuracyCircleRef.current?.remove();
    } catch {
      // ignore
    }
    userAccuracyCircleRef.current = null;

    userEverCenteredRef.current = false;
    setIsUserTracking(false);
  }, []);

  const startUserTracking = () => {
    setGeoError(null);

    const L = leafletRef.current;
    const map = mapRef.current;

    if (!L || !map) {
      setGeoError("Карта ещё загружается");
      return;
    }

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGeoError("Геолокация недоступна в этом браузере");
      return;
    }

    // Ensure previous session is stopped
    stopUserTracking();
    setIsUserTracking(true);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const accuracy = Math.max(0, pos.coords.accuracy || 0);

        const latlng = [lat, lon] as [number, number];

        try {
          if (!userMarkerRef.current) {
            userMarkerRef.current = L.circleMarker(latlng, {
              radius: 6,
              color: "#111111",
              weight: 2,
              fillColor: "#111111",
              fillOpacity: 1,
            }).addTo(map);
          } else {
            // CircleMarker supports setLatLng
            (
              userMarkerRef.current as unknown as {
                setLatLng: (x: unknown) => void;
              }
            ).setLatLng(latlng);
          }

          if (!userAccuracyCircleRef.current) {
            userAccuracyCircleRef.current = L.circle(latlng, {
              radius: accuracy,
              color: "#111111",
              weight: 1,
              opacity: 0.2,
              fillColor: "#111111",
              fillOpacity: 0.06,
            }).addTo(map);
          } else {
            userAccuracyCircleRef.current.setLatLng(latlng);
            userAccuracyCircleRef.current.setRadius(accuracy);
          }
        } catch {
          // ignore
        }

        // Follow user while tracking
        try {
          if (!userEverCenteredRef.current) {
            userEverCenteredRef.current = true;
            map.setView(latlng, Math.max(map.getZoom(), 14), { animate: true });
          } else {
            map.panTo(latlng, { animate: true });
          }
        } catch {
          // ignore
        }
      },
      (err) => {
        setGeoError(err.message || "Не удалось получить геолокацию");
        stopUserTracking();
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10_000,
      }
    );

    geoWatchIdRef.current = watchId;
  };

  const destroyMap = () => {
    stopUserTracking();
    try {
      markerRef.current?.remove();
    } catch {
      // ignore
    }
    markerRef.current = null;

    try {
      mapRef.current?.remove();
    } catch {
      // ignore
    }
    mapRef.current = null;
  };

  useEffect(() => {
    if (step !== "map") {
      destroyMap();
      return;
    }

    const seq = ++initSeqRef.current;
    let cancelled = false;

    const init = async () => {
      const leafletModule = await import("leaflet");
      const L: typeof import("leaflet") =
        (leafletModule as unknown as { default?: typeof import("leaflet") })
          .default ?? (leafletModule as unknown as typeof import("leaflet"));

      if (cancelled || initSeqRef.current !== seq) return;

      leafletRef.current = L;

      if (!iconFixedRef.current) {
        try {
          // Fix default marker icon paths under bundlers
          const icon2x = (
            await import("leaflet/dist/images/marker-icon-2x.png")
          ).default as unknown as string;
          const icon1x = (await import("leaflet/dist/images/marker-icon.png"))
            .default as unknown as string;
          const shadow = (await import("leaflet/dist/images/marker-shadow.png"))
            .default as unknown as string;

          delete (
            L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown }
          )._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: icon2x,
            iconUrl: icon1x,
            shadowUrl: shadow,
          });
        } catch {
          // ignore
        }

        iconFixedRef.current = true;
      }

      const el = document.getElementById("pickup-leaflet-map");
      if (!el) return;

      // If a map already exists, do not create a new one.
      if (mapRef.current) return;

      // Defensive: if some previous init left a leaflet id on the element.
      const anyEl = el as unknown as { _leaflet_id?: unknown };
      if (anyEl._leaflet_id) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete anyEl._leaflet_id;
        } catch {
          anyEl._leaflet_id = undefined;
        }
      }

      const urlLat = Number(searchParams.get("lat"));
      const urlLon = Number(searchParams.get("lon"));
      const urlHasCenter = Number.isFinite(urlLat) && Number.isFinite(urlLon);

      const centerLat = selection?.lat ?? (urlHasCenter ? urlLat : 55.751244);
      const centerLon = selection?.lon ?? (urlHasCenter ? urlLon : 37.618423);

      const markerLat = selection?.lat ?? (urlHasCenter ? urlLat : null);
      const markerLon = selection?.lon ?? (urlHasCenter ? urlLon : null);
      const hasMarker =
        markerLat != null &&
        markerLon != null &&
        Number.isFinite(markerLat) &&
        Number.isFinite(markerLon);

      const map = L.map(el, {
        zoomControl: false,
        attributionControl: false,
      }).setView([centerLat, centerLon], hasMarker ? 12 : 10);

      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      if (hasMarker) {
        markerRef.current = L.marker([markerLat, markerLon]).addTo(map);
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [step, searchParams, selection]);

  useEffect(() => {
    if (step !== "map") return;

    if (isUserTracking) return;

    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    const urlLat = Number(searchParams.get("lat"));
    const urlLon = Number(searchParams.get("lon"));
    const urlHasCenter = Number.isFinite(urlLat) && Number.isFinite(urlLon);

    const centerLat = selection?.lat ?? (urlHasCenter ? urlLat : 55.751244);
    const centerLon = selection?.lon ?? (urlHasCenter ? urlLon : 37.618423);

    const markerLat = selection?.lat ?? (urlHasCenter ? urlLat : null);
    const markerLon = selection?.lon ?? (urlHasCenter ? urlLon : null);
    const hasMarker =
      markerLat != null &&
      markerLon != null &&
      Number.isFinite(markerLat) &&
      Number.isFinite(markerLon);

    map.setView([centerLat, centerLon], hasMarker ? 12 : 10, { animate: true });

    try {
      markerRef.current?.remove();
    } catch {
      // ignore
    }
    markerRef.current = null;

    if (hasMarker) {
      markerRef.current = L.marker([markerLat, markerLon]).addTo(map);
    }
  }, [step, searchParams, selection, isUserTracking]);

  useEffect(() => {
    if (step !== "map") {
      stopUserTracking();
    }

    return () => {
      stopUserTracking();
    };
  }, [step, stopUserTracking]);

  const Toggle = (
    <div className="bg-[#F4F3F1] rounded-2xl p-1 flex">
      <button
        type="button"
        aria-pressed={step === "map"}
        className={
          "flex-1 h-9 rounded-2xl text-[14px] font-medium transition-colors " +
          (step === "map"
            ? "bg-white text-black"
            : "bg-transparent text-[#7E7E7E]")
        }
        onClick={() => setStepAndUrl("map")}
      >
        На карте
      </button>
      <button
        type="button"
        aria-pressed={step === "list"}
        className={
          "flex-1 h-9 rounded-2xl text-[14px] font-medium transition-colors " +
          (step === "list"
            ? "bg-white text-black"
            : "bg-transparent text-[#7E7E7E]")
        }
        onClick={() => setStepAndUrl("list")}
      >
        Списком
      </button>
    </div>
  );

  if (step === "map") {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="h-screen w-full bg-[#F4F3F1] relative">
          <div id="pickup-leaflet-map" className="h-full w-full" />

          <button
            type="button"
            aria-label="Определить моё местоположение"
            aria-pressed={isUserTracking}
            onClick={() =>
              isUserTracking ? stopUserTracking() : startUserTracking()
            }
            className={
              "absolute right-4 bottom-24 z-1000 w-[46px] h-[46px] rounded-[50%] border border-[#E5E5E5] bg-white shadow-sm grid place-items-center transition-colors " +
              (isUserTracking ? "bg-[#F4F3F1]" : "")
            }
          >
            <img src="/icons/global/Vector.svg" alt="" />
          </button>

          {geoError ? (
            <div className="absolute left-4 right-4 bottom-[140px] z-1000">
              <div className="mx-auto w-full max-w-[380px] bg-white/95 border border-[#E5E5E5] rounded-2xl px-4 py-2 text-[12px] text-black">
                {geoError}
              </div>
            </div>
          ) : null}

          <div className="absolute top-4 left-4 right-4 z-1000">
            <div className="mx-auto w-full max-w-[380px]">{Toggle}</div>
          </div>
        </div>

        <div className="fixed z-1000 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-4 py-4">
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full rounded-2xl"
            onClick={() => setStepAndUrl("search")}
          >
            Поиск города
          </Button>
        </div>
      </div>
    );
  }

  if (step === "search") {
    return (
      <div className="max-w-md mx-auto bg-white min-h-screen">
        <div className="px-4 pt-2">
          <div className="mt-4 bg-[#F4F3F1] rounded-2xl h-11 flex items-center gap-2 px-3">
            <img
              src="/icons/global/Search.svg"
              alt="search"
              className="w-[18px] h-[18px] opacity-60"
            />
            <input
              value={query}
              onChange={(e) => {
                const next = e.target.value;
                setQuery(next);
                if (!next.trim()) {
                  setSuggestions([]);
                }
              }}
              className="flex-1 bg-transparent outline-none text-[14px] text-black placeholder:text-[#7E7E7E]"
              placeholder="Адрес"
            />
            {query.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setSuggestions([]);
                }}
                className="w-7 h-7 grid place-items-center"
                aria-label="Clear"
              >
                <img
                  src="/icons/global/xicon.svg"
                  alt="clear"
                  className="w-4 h-4 opacity-60"
                />
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-2">
          {items.map((p, idx) => (
            <button
              type="button"
              key={p.id}
              onClick={() => {
                stopUserTracking();
                const params = new URLSearchParams();
                params.set("step", "map");
                params.set("address", p.title);
                if (p.lat != null) params.set("lat", String(p.lat));
                if (p.lon != null) params.set("lon", String(p.lon));

                router.replace(`/checkout/pickup?${params.toString()}`);
                setStep("map");
              }}
              className={
                "w-full text-left px-4 py-4 flex items-start gap-3 " +
                (idx === items.length - 1 ? "" : "border-b border-[#E5E5E5]")
              }
            >
              <img
                src="/icons/global/location.svg"
                alt="location"
                className="w-5 h-5 mt-0.5 opacity-70"
              />
              <div className="min-w-0">
                <div className="text-[14px] font-semibold text-black">
                  {p.title}
                </div>
                {p.subtitle ? (
                  <div className="text-[12px] text-[#7E7E7E]">{p.subtitle}</div>
                ) : null}
              </div>
            </button>
          ))}

          {query.trim() && items.length === 0 ? (
            <div className="px-4 py-6 text-[14px] text-[#7E7E7E]">
              Ничего не найдено
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen">
      <div className="px-4 pt-4">
        <div className="mt-1">{Toggle}</div>
        <div className="mt-2 bg-[#F4F3F1] rounded-2xl h-11 flex items-center gap-2 px-3">
          <img
            src="/icons/global/Search.svg"
            alt="search"
            className="w-[18px] h-[18px] opacity-60"
          />
          <input
            value={pvzQuery}
            onChange={(e) => setPvzQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-[14px] text-black placeholder:text-[#7E7E7E]"
            placeholder="Адрес"
          />
          {pvzQuery.length > 0 ? (
            <button
              type="button"
              onClick={() => setPvzQuery("")}
              className="w-7 h-7 grid place-items-center"
              aria-label="Clear"
            >
              <img
                src="/icons/global/xicon.svg"
                alt="clear"
                className="w-4 h-4 opacity-60"
              />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-2">
        {filteredPvz.map((p, idx) => (
          <button
            type="button"
            key={p.id}
            onClick={() => {
              stopUserTracking();
              setSelection({
                title: p.provider,
                subtitle: p.address,
                lat: p.lat,
                lon: p.lon,
              });

              setStepAndUrl("map");
            }}
            className={
              "w-full text-left px-4 py-4 " +
              (idx === filteredPvz.length - 1
                ? ""
                : "border-b border-[#E5E5E5]")
            }
          >
            <div className="min-w-0">
              <div className="text-[22px] font-bold text-black leading-tight">
                {p.provider}
              </div>
              <div className="mt-1 text-[14px] text-black">{p.address}</div>
              <div className="mt-2 text-[14px] text-black">
                {p.deliveryText}
              </div>
              <div className="mt-2 text-[14px] text-black">{p.priceText}</div>
            </div>
          </button>
        ))}

        {filteredPvz.length === 0 ? (
          <div className="px-4 py-6 text-[14px] text-[#7E7E7E]">
            Ничего не найдено
          </div>
        ) : null}
      </div>
    </div>
  );
}

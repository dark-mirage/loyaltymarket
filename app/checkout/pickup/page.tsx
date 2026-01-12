"use client";

import React, {
  Suspense,
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

const PVZ_PROVIDERS: PvzProvider[] = [
  "Яндекс Доставка",
  "CDEK",
  "Boxberry",
  "Почта России",
];

function generateTestPvzPoints(count: number): PvzPoint[] {
  const cities = [
    { city: "Москва", lat: 55.751244, lon: 37.618423 },
    { city: "Санкт-Петербург", lat: 59.938732, lon: 30.316229 },
    { city: "Новосибирск", lat: 55.030199, lon: 82.92043 },
    { city: "Екатеринбург", lat: 56.838011, lon: 60.597465 },
    { city: "Казань", lat: 55.796127, lon: 49.106414 },
    { city: "Нижний Новгород", lat: 56.326944, lon: 44.0075 },
    { city: "Самара", lat: 53.195873, lon: 50.100193 },
    { city: "Омск", lat: 54.989342, lon: 73.368212 },
    { city: "Ростов-на-Дону", lat: 47.235713, lon: 39.701505 },
    { city: "Уфа", lat: 54.738762, lon: 55.972055 },
    { city: "Красноярск", lat: 56.010563, lon: 92.852572 },
    { city: "Воронеж", lat: 51.660781, lon: 39.200269 },
    { city: "Пермь", lat: 58.010455, lon: 56.229443 },
    { city: "Волгоград", lat: 48.708048, lon: 44.513303 },
    { city: "Краснодар", lat: 45.03547, lon: 38.975313 },
    { city: "Саратов", lat: 51.533103, lon: 46.034158 },
    { city: "Тюмень", lat: 57.153033, lon: 65.534328 },
    { city: "Тольятти", lat: 53.507836, lon: 49.420393 },
    { city: "Ижевск", lat: 56.852744, lon: 53.211396 },
    { city: "Барнаул", lat: 53.347997, lon: 83.779806 },
    { city: "Иркутск", lat: 52.286387, lon: 104.28066 },
    { city: "Хабаровск", lat: 48.480223, lon: 135.071917 },
    { city: "Владивосток", lat: 43.115536, lon: 131.885485 },
    { city: "Ярославль", lat: 57.626074, lon: 39.88447 },
    { city: "Сочи", lat: 43.585472, lon: 39.723098 },
    { city: "Калининград", lat: 54.710426, lon: 20.452214 },
    { city: "Мурманск", lat: 68.970682, lon: 33.074981 },
    { city: "Севастополь", lat: 44.61665, lon: 33.525367 },
  ];

  const streets = [
    "Ленина ул",
    "Советская ул",
    "Мира ул",
    "Победы ул",
    "Школьная ул",
    "Набережная ул",
    "Садовая ул",
    "Центральная ул",
    "Парковая ул",
    "Зеленая ул",
  ];

  const deliveryTextByProvider: Record<PvzProvider, string> = {
    "Яндекс Доставка": "Доставка 1-3 дня",
    CDEK: "Доставка 2-5 дней",
    Boxberry: "Доставка 2-6 дней",
    "Почта России": "Доставка 3-7 дней",
  };

  const points: PvzPoint[] = [];

  const mulberry32 = (seed: number) => {
    let t = seed >>> 0;
    return () => {
      t += 0x6d2b79f5;
      let x = Math.imul(t ^ (t >>> 15), 1 | t);
      x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  };

  const perCityBase = Math.floor(count / cities.length);
  const remainder = count % cities.length;
  let globalIndex = 0;

  for (let cityIndex = 0; cityIndex < cities.length; cityIndex++) {
    const city = cities[cityIndex];
    const cityCount = perCityBase + (cityIndex < remainder ? 1 : 0);

    for (let j = 0; j < cityCount; j++) {
      if (globalIndex >= count) break;

      // Cycle providers inside each city so every city has all 4 types.
      const provider = PVZ_PROVIDERS[j % PVZ_PROVIDERS.length];
      const street = streets[(globalIndex + cityIndex) % streets.length];
      const house = 1 + ((globalIndex * 7) % 140);
      const building = 1 + (globalIndex % 5);

      const rand = mulberry32(cityIndex * 10_000 + j + 1);
      const angle = rand() * Math.PI * 2;
      const radius = 0.01 + rand() * 0.18; // ~1km..20km (rough)
      const dLat = Math.sin(angle) * radius;
      const dLon =
        Math.cos(angle) * radius * Math.cos((city.lat * Math.PI) / 180);

      const lat = city.lat + dLat;
      const lon = city.lon + dLon;

      const price = 199 + ((globalIndex * 37) % 1200);

      points.push({
        id: `pvz-${globalIndex + 1}`,
        provider,
        address: `${city.city}, ${street}, д. ${house}, стр. ${building}`,
        deliveryText: deliveryTextByProvider[provider],
        priceText: `Стоимость — ${price}₽`,
        lat,
        lon,
      });

      globalIndex++;
    }
  }

  return points;
}

const TEST_PVZ_POINTS: PvzPoint[] = generateTestPvzPoints(500);

export default function CheckoutPickupPage() {
  return (
    <Suspense
      fallback={<div className="max-w-md mx-auto bg-white min-h-screen" />}
    >
      <CheckoutPickupPageInner />
    </Suspense>
  );
}

function CheckoutPickupPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();

  const leafletRef = useRef<typeof import("leaflet") | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markerRef = useRef<import("leaflet").Marker | null>(null);
  const pvzLayerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const pvzMarkersRef = useRef<Map<string, import("leaflet").Marker>>(
    new Map()
  );
  const userMarkerRef = useRef<
    import("leaflet").CircleMarker | import("leaflet").Marker | null
  >(null);
  const userAccuracyCircleRef = useRef<import("leaflet").Circle | null>(null);
  const geoWatchIdRef = useRef<number | null>(null);
  const userEverCenteredRef = useRef(false);
  const initSeqRef = useRef(0);
  const iconFixedRef = useRef(false);

  const initialStep = useMemo<"search" | "map" | "list">(() => {
    const step = new URLSearchParams(searchParamsKey).get("step");
    if (step === "map" || step === "list" || step === "search") return step;
    return "search";
  }, [searchParamsKey]);

  const [step, setStep] = useState<"search" | "map" | "list">(initialStep);

  useEffect(() => {
    setStep(initialStep);
  }, [initialStep]);

  const [pvzQuery, setPvzQuery] = useState("");

  const [mapInitTick, setMapInitTick] = useState(0);
  const [mapViewTick, setMapViewTick] = useState(0);
  const mapBumpRafRef = useRef<number | null>(null);

  const selectedPvzId = useMemo(() => {
    const id = new URLSearchParams(searchParamsKey).get("pvzId");
    return id && id.trim() ? id : null;
  }, [searchParamsKey]);

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

  const replacePickupUrl = useCallback(
    (update: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParamsKey);
      update(params);
      router.replace(`/checkout/pickup?${params.toString()}`);
    },
    [router, searchParamsKey]
  );

  const setStepAndUrl = (next: "search" | "map" | "list") => {
    setStep(next);
    replacePickupUrl((params) => {
      params.set("step", next);
    });
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

  const selectPvzOnMap = useCallback(
    (pvzId: string) => {
      stopUserTracking();
      setStep("map");
      replacePickupUrl((params) => {
        params.set("step", "map");
        params.set("pvzId", pvzId);
        params.delete("address");
        params.delete("lat");
        params.delete("lon");
      });
    },
    [replacePickupUrl, stopUserTracking]
  );

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

  const destroyMap = useCallback(() => {
    stopUserTracking();

    try {
      markerRef.current?.remove();
    } catch {
      // ignore
    }
    markerRef.current = null;

    try {
      pvzLayerRef.current?.remove();
    } catch {
      // ignore
    }
    pvzLayerRef.current = null;
    pvzMarkersRef.current.clear();

    try {
      mapRef.current?.remove();
    } catch {
      // ignore
    }
    mapRef.current = null;
  }, [stopUserTracking]);

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

      const params = new URLSearchParams(searchParamsKey);

      const selectedFromUrl = params.get("pvzId");
      const selectedPoint = selectedFromUrl
        ? TEST_PVZ_POINTS.find((p) => p.id === selectedFromUrl)
        : undefined;

      const urlLat = Number(params.get("lat"));
      const urlLon = Number(params.get("lon"));
      const urlHasCenter = Number.isFinite(urlLat) && Number.isFinite(urlLon);

      const centerLat =
        selectedPoint?.lat ?? (urlHasCenter ? urlLat : 55.751244);
      const centerLon =
        selectedPoint?.lon ?? (urlHasCenter ? urlLon : 37.618423);

      const markerLat = selectedPoint ? null : urlHasCenter ? urlLat : null;
      const markerLon = selectedPoint ? null : urlHasCenter ? urlLon : null;
      const hasMarker = markerLat != null && markerLon != null;

      const map = L.map(el, {
        zoomControl: false,
        attributionControl: false,
      }).setView([centerLat, centerLon], hasMarker ? 12 : 10);

      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      pvzLayerRef.current = L.layerGroup().addTo(map);
      setMapInitTick((x) => x + 1);

      const bump = () => {
        if (mapBumpRafRef.current != null) return;
        mapBumpRafRef.current = window.requestAnimationFrame(() => {
          mapBumpRafRef.current = null;
          setMapViewTick((x) => x + 1);
        });
      };

      map.on("moveend", bump);
      map.on("zoomend", bump);
      // Kick the first render asynchronously to avoid update-depth loops.
      window.setTimeout(bump, 0);

      if (hasMarker) {
        markerRef.current = L.marker([markerLat, markerLon]).addTo(map);
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [step, searchParamsKey, destroyMap]);

  const getPvzMarkerIcon = useCallback(
    (
      L: typeof import("leaflet"),
      provider: PvzProvider,
      isSelected: boolean
    ) => {
      const colorByProvider: Record<PvzProvider, string> = {
        "Яндекс Доставка": "#111111",
        CDEK: "#16A34A",
        Boxberry: "#F97316",
        "Почта России": "#2563EB",
      };

      const color = colorByProvider[provider] ?? "#111111";
      const size = isSelected ? 18 : 14;
      const ring = isSelected ? 4 : 2;

      return L.divIcon({
        className: "",
        iconSize: [size + ring, size + ring],
        iconAnchor: [(size + ring) / 2, (size + ring) / 2],
        html: `
          <div style="
            width:${size + ring}px;
            height:${size + ring}px;
            border-radius:9999px;
            background: rgba(255,255,255,0.9);
            border:${ring}px solid ${color};
            box-shadow: 0 6px 18px rgba(0,0,0,0.15);
            display:flex;
            align-items:center;
            justify-content:center;
          ">
            <div style="
              width:${size}px;
              height:${size}px;
              border-radius:9999px;
              background:${color};
            "></div>
          </div>
        `,
      });
    },
    []
  );

  useEffect(() => {
    if (step !== "map") return;

    const L = leafletRef.current;
    const map = mapRef.current;
    const layer = pvzLayerRef.current;
    if (!L || !map || !layer) return;

    // Only render markers within current map bounds to keep performance OK with 1000+ points.
    let bounds = map.getBounds();
    try {
      bounds = bounds.pad(0.25);
    } catch {
      // ignore
    }

    const pointsInView = TEST_PVZ_POINTS.filter((p) =>
      bounds.contains([p.lat, p.lon])
    );
    const nextIds = new Set(pointsInView.map((p) => p.id));

    // Remove markers that left the viewport.
    for (const [id, marker] of pvzMarkersRef.current.entries()) {
      if (nextIds.has(id)) continue;
      try {
        marker.remove();
      } catch {
        // ignore
      }
      pvzMarkersRef.current.delete(id);
    }

    // Add/update visible markers.
    for (const point of pointsInView) {
      const isSelected = selectedPvzId === point.id;
      const existing = pvzMarkersRef.current.get(point.id);

      if (existing) {
        try {
          existing.setIcon(getPvzMarkerIcon(L, point.provider, isSelected));
        } catch {
          // ignore
        }
        continue;
      }

      const marker = L.marker([point.lat, point.lon], {
        icon: getPvzMarkerIcon(L, point.provider, isSelected),
        keyboard: false,
        title: `${point.provider} — ${point.address}`,
      })
        .addTo(layer)
        .on("click", () => {
          selectPvzOnMap(point.id);
        });

      marker.bindPopup(
        `<div style="min-width: 200px">
          <div style="font-weight:700; font-size:14px; margin-bottom:4px">${point.provider}</div>
          <div style="font-size:12px; color:#555">${point.address}</div>
          <div style="font-size:12px; margin-top:8px">${point.deliveryText}</div>
          <div style="font-size:12px; margin-top:4px">${point.priceText}</div>
        </div>`,
        { closeButton: true }
      );

      pvzMarkersRef.current.set(point.id, marker);
    }

    // Auto focus/open popup for selected point if it is visible.
    if (selectedPvzId) {
      const marker = pvzMarkersRef.current.get(selectedPvzId);
      if (marker) {
        try {
          marker.openPopup();
        } catch {
          // ignore
        }
      }
    }
  }, [
    step,
    mapInitTick,
    mapViewTick,
    selectedPvzId,
    getPvzMarkerIcon,
    selectPvzOnMap,
  ]);

  useEffect(() => {
    if (step !== "map") return;

    if (isUserTracking) return;

    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    const params = new URLSearchParams(searchParamsKey);

    const selectedFromUrl = params.get("pvzId");
    const selectedPoint = selectedFromUrl
      ? TEST_PVZ_POINTS.find((p) => p.id === selectedFromUrl)
      : undefined;

    const urlLat = Number(params.get("lat"));
    const urlLon = Number(params.get("lon"));
    const urlHasCenter = Number.isFinite(urlLat) && Number.isFinite(urlLon);

    const centerLat = selectedPoint?.lat ?? (urlHasCenter ? urlLat : 55.751244);
    const centerLon = selectedPoint?.lon ?? (urlHasCenter ? urlLon : 37.618423);

    const markerLat = selectedPoint ? null : urlHasCenter ? urlLat : null;
    const markerLon = selectedPoint ? null : urlHasCenter ? urlLon : null;
    const hasMarker = markerLat != null && markerLon != null;

    const nextZoom = hasMarker ? 12 : 10;
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();
    const eps = 1e-6;
    const needsMove =
      Math.abs(currentCenter.lat - centerLat) > eps ||
      Math.abs(currentCenter.lng - centerLon) > eps;
    const needsZoom = currentZoom !== nextZoom;

    if (needsMove || needsZoom) {
      map.setView([centerLat, centerLon], nextZoom, { animate: true });
    }

    try {
      markerRef.current?.remove();
    } catch {
      // ignore
    }
    markerRef.current = null;

    if (hasMarker) {
      markerRef.current = L.marker([markerLat, markerLon]).addTo(map);
    }
  }, [step, searchParamsKey, isUserTracking]);

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
              selectPvzOnMap(p.id);
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

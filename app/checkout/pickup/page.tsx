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
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
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

type LatLon = { lat: number; lon: number };

function distanceKm(a: LatLon, b: LatLon): number {
  const R = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

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
  const pvzClusterRef = useRef<import("leaflet").LayerGroup | null>(null);
  const pvzMarkersRef = useRef<Map<string, import("leaflet").Marker>>(
    new Map()
  );
  const pvzProviderByIdRef = useRef<Map<string, PvzProvider>>(new Map());
  const pvzPointsRef = useRef<PvzPoint[] | null>(null);
  const pvzPointByIdRef = useRef<Map<string, PvzPoint> | null>(null);
  const prevSelectedPvzIdRef = useRef<string | null>(null);
  const userMarkerRef = useRef<
    import("leaflet").CircleMarker | import("leaflet").Marker | null
  >(null);
  const userAccuracyCircleRef = useRef<import("leaflet").Circle | null>(null);
  const geoWatchIdRef = useRef<number | null>(null);
  const userEverCenteredRef = useRef(false);
  const initSeqRef = useRef(0);
  const iconFixedRef = useRef(false);

  const ensurePvzPoints = useCallback((): PvzPoint[] => {
    if (!pvzPointsRef.current) {
      pvzPointsRef.current = generateTestPvzPoints(500);
    }
    return pvzPointsRef.current;
  }, []);

  const ensurePvzIndex = useCallback((): Map<string, PvzPoint> => {
    if (!pvzPointByIdRef.current) {
      const index = new Map<string, PvzPoint>();
      for (const p of ensurePvzPoints()) index.set(p.id, p);
      pvzPointByIdRef.current = index;
    }
    return pvzPointByIdRef.current;
  }, [ensurePvzPoints]);

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

  const [activeProvider, setActiveProvider] = useState<"all" | PvzProvider>(
    "all"
  );

  const selectedPvzId = useMemo(() => {
    const id = new URLSearchParams(searchParamsKey).get("pvzId");
    return id && id.trim() ? id : null;
  }, [searchParamsKey]);

  useEffect(() => {
    if (!selectedPvzId) return;
    const selectedPoint = ensurePvzIndex().get(selectedPvzId);
    if (!selectedPoint) return;
    setActiveProvider(selectedPoint.provider);
  }, [ensurePvzIndex, selectedPvzId]);

  const [isUserTracking, setIsUserTracking] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LatLon | null>(null);
  const lastUserLocationRef = useRef<LatLon | null>(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<
    NonNullable<DaDataSuggestAddressResponse["suggestions"]>
  >([]);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setSuggestions([]);
      return;
    }

    const ctrl = new AbortController();

    const t = window.setTimeout(async () => {
      try {
        const res = await fetch("/api/dadata/suggest/address", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q, count: 10 }),
          signal: ctrl.signal,
        });

        if (!res.ok) {
          setSuggestions([]);
          return;
        }

        const data: unknown = await res.json();
        const s = (data as DaDataSuggestAddressResponse)?.suggestions;
        setSuggestions(Array.isArray(s) ? s : []);
      } catch {
        if (ctrl.signal.aborted) return;
        setSuggestions([]);
      }
    }, 250);

    return () => {
      window.clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  const items = useMemo((): SuggestItem[] => {
    if (!query.trim()) return [];
    if (suggestions.length === 0) return [];

    return suggestions.map((x, index) => {
      const d = x.data;
      const subtitle =
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
    if (step !== "list") return [] as PvzPoint[];

    const allPoints = ensurePvzPoints();
    const q = pvzQuery.trim().toLowerCase();
    const base = !q
      ? allPoints
      : allPoints.filter((x) => {
          const hay = `${x.provider} ${x.address}`.toLowerCase();
          return hay.includes(q);
        });

    const providerFiltered =
      activeProvider === "all"
        ? base
        : base.filter((x) => x.provider === activeProvider);

    if (!userLocation) return providerFiltered;

    // Show nearest PVZ first once user's location is known.
    return [...providerFiltered].sort((a, b) => {
      const da = distanceKm(userLocation, { lat: a.lat, lon: a.lon });
      const db = distanceKm(userLocation, { lat: b.lat, lon: b.lon });
      return da - db;
    });
  }, [ensurePvzPoints, activeProvider, pvzQuery, step, userLocation]);

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
    lastUserLocationRef.current = null;
    setUserLocation(null);
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

  const openPvzPopup = useCallback(
    (pvzId: string) => {
      const marker = pvzMarkersRef.current.get(pvzId);
      if (!marker) return;

      if (isUserTracking) return;

      const map = mapRef.current;
      const panToMarker = () => {
        if (!map) return;
        try {
          const latlng = (
            marker as unknown as {
              getLatLng: () => { lat: number; lng: number };
            }
          ).getLatLng();

          map.panTo(latlng, { animate: true });
        } catch {
          // ignore
        }
      };

      const cluster = pvzClusterRef.current as
        | (import("leaflet").LayerGroup & {
            zoomToShowLayer?: (layer: unknown, cb: () => void) => void;
          })
        | null;

      const tryOpen = () => {
        panToMarker();
        try {
          marker.openPopup();
        } catch {
          // ignore
        }
      };

      if (cluster?.zoomToShowLayer) {
        try {
          cluster.zoomToShowLayer(marker as unknown as unknown, tryOpen);
          return;
        } catch {
          // ignore and fallback
        }
      }

      tryOpen();
    },
    [isUserTracking]
  );

  useEffect(() => {
    if (step !== "map") return;

    const cluster = pvzClusterRef.current as unknown as {
      clearLayers?: () => void;
      addLayers?: (xs: unknown[]) => void;
      addLayer?: (x: unknown) => void;
    } | null;

    if (!cluster?.clearLayers) return;

    const enabledProviders = new Set<PvzProvider>(
      activeProvider === "all" ? PVZ_PROVIDERS : [activeProvider]
    );

    // Safety: keep selected PVZ visible even if filter doesn't match yet.
    if (selectedPvzId) {
      const selectedProvider = ensurePvzIndex().get(selectedPvzId)?.provider;
      if (selectedProvider) enabledProviders.add(selectedProvider);
    }

    const markers: import("leaflet").Marker[] = [];
    for (const [id, marker] of pvzMarkersRef.current.entries()) {
      const provider = pvzProviderByIdRef.current.get(id);
      if (!provider) continue;
      if (!enabledProviders.has(provider)) continue;
      markers.push(marker);
    }

    try {
      cluster.clearLayers();
    } catch {
      // ignore
    }

    if (cluster.addLayers) {
      cluster.addLayers(markers as unknown as unknown[]);
    } else if (cluster.addLayer) {
      for (const m of markers) cluster.addLayer(m);
    }

    if (selectedPvzId) {
      requestAnimationFrame(() => openPvzPopup(selectedPvzId));
    }
  }, [openPvzPopup, activeProvider, ensurePvzIndex, selectedPvzId, step]);

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

        // Keep the latest user location for sorting PVZ list.
        const prev = lastUserLocationRef.current;
        const nextLoc = { lat, lon };
        // GPS can be noisy; avoid re-sorting PVZ list on tiny jitter.
        if (!prev || distanceKm(prev, nextLoc) > 0.03) {
          lastUserLocationRef.current = nextLoc;
          setUserLocation(nextLoc);
        }

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
      pvzClusterRef.current?.remove();
    } catch {
      // ignore
    }
    pvzClusterRef.current = null;
    pvzMarkersRef.current.clear();
    pvzProviderByIdRef.current.clear();
    prevSelectedPvzIdRef.current = null;

    try {
      mapRef.current?.remove();
    } catch {
      // ignore
    }
    mapRef.current = null;
  }, [stopUserTracking]);

  const getPvzMarkerIcon = useCallback(
    (
      L: typeof import("leaflet"),
      provider: PvzProvider,
      isSelected: boolean
    ) => {
      const bubble = isSelected ? 54 : 48;
      const tail = isSelected ? 16 : 14;
      const border = isSelected ? 3 : 2;
      const totalH = bubble + Math.floor(tail / 2);
      const tailTop = bubble - Math.floor(tail / 2);
      const shadow = isSelected
        ? "0 14px 30px rgba(0,0,0,0.30)"
        : "0 10px 22px rgba(0,0,0,0.22)";

      const iconHtml = (() => {
        switch (provider) {
          case "CDEK":
            return `
             <img src="/icons/global/CDEK.svg" alt="CDEK.svg" />
            `;
          case "Boxberry":
            return `
              <img src="/icons/global/boxberry.svg" alt="boxberry.svg" />
            `;
          case "Яндекс Доставка":
            return `
              <div style="
                font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
                font-weight: 800;
                font-size: 22px;
                line-height: 1;
                color: #FFFFFF;
                transform: translateY(-1px);
              ">Я</div>
            `;
          case "Почта России":
            return `
              <div style="
                font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
                font-weight: 800;
                font-size: 8px;
                line-height: 1.05;
                letter-spacing: 0.02em;
                text-transform: uppercase;
                color: #FFFFFF;
                text-align: center;
                transform: translateY(-1px);
              ">ПОЧТА<br/>РОССИИ</div>
            `;
          default:
            return "";
        }
      })();

      return L.divIcon({
        className: "pvz-div-icon",
        iconSize: [bubble, totalH],
        iconAnchor: [bubble / 2, totalH],
        html: `
          <div style="position:relative; width:${bubble}px; height:${totalH}px;">
            <div style="
              position:absolute;
              left:0;
              top:0;
              width:${bubble}px;
              height:${bubble}px;
              border-radius:9999px;
              background:#111111;
              border:${border}px solid #FFFFFF;
              box-shadow:${shadow};
              display:flex;
              align-items:center;
              justify-content:center;
            ">
              <div style=" display:flex; align-items:center; justify-content:center;">
                ${iconHtml}
              </div>
            </div>
            <div style="
              position:absolute;
              left:50%;
              top:${tailTop}px;
              width:${tail}px;
              height:${tail}px;
              background:#111111;
              border:${border}px solid #FFFFFF;
              transform: translateX(-50%) rotate(45deg);
              border-radius: 3px;
              box-shadow:${shadow};
            "></div>
          </div>
        `,
      });
    },
    []
  );

  useEffect(() => {
    if (step !== "map") {
      destroyMap();
      return;
    }

    // If a map already exists, do not redo heavy init / imports.
    if (mapRef.current) return;

    const seq = ++initSeqRef.current;
    let cancelled = false;

    const init = async () => {
      const leafletModule = await import("leaflet");
      const L: typeof import("leaflet") =
        (leafletModule as unknown as { default?: typeof import("leaflet") })
          .default ?? (leafletModule as unknown as typeof import("leaflet"));

      // Marker clustering plugin patches Leaflet with markerClusterGroup().
      await import("leaflet.markercluster");

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
          delete anyEl._leaflet_id;
        } catch {
          anyEl._leaflet_id = undefined;
        }
      }

      const params = new URLSearchParams(searchParamsKey);

      const selectedFromUrl = params.get("pvzId");
      const pvzIndex = ensurePvzIndex();
      const selectedPoint = selectedFromUrl
        ? pvzIndex.get(selectedFromUrl)
        : undefined;

      const urlLat = Number(params.get("lat"));
      const urlLon = Number(params.get("lon"));
      const urlHasCenter = Number.isFinite(urlLat) && Number.isFinite(urlLon);

      const centerLat =
        selectedPoint?.lat ?? (urlHasCenter ? urlLat : 55.751244);
      const centerLon =
        selectedPoint?.lon ?? (urlHasCenter ? urlLon : 37.618423);

      const hasMarker = !selectedPoint && urlHasCenter;
      const hasSelectedPvz = Boolean(selectedPoint);

      const initialZoom = hasSelectedPvz ? 14 : hasMarker ? 12 : 10;

      const map = L.map(el, {
        zoomControl: false,
        attributionControl: false,
      }).setView([centerLat, centerLon], initialZoom);

      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      const markerClusterGroupFactory = (
        L as unknown as {
          markerClusterGroup?: (
            options?: unknown
          ) => import("leaflet").LayerGroup;
        }
      ).markerClusterGroup;

      const clusterGroup = markerClusterGroupFactory
        ? markerClusterGroupFactory({
            showCoverageOnHover: false,
            spiderfyOnMaxZoom: true,
            zoomToBoundsOnClick: true,
            maxClusterRadius: 52,
            chunkedLoading: true,
            iconCreateFunction: (cluster: unknown) => {
              const c = cluster as { getChildCount: () => number };
              const count = c.getChildCount();
              const size = count < 10 ? 34 : count < 100 ? 40 : 46;

              return L.divIcon({
                className: "",
                iconSize: [size, size],
                iconAnchor: [size / 2, size / 2],
                html: `<div style="
                  width:${size}px;
                  height:${size}px;
                  border-radius:9999px;
                  background: rgba(17,17,17,0.92);
                  color: #fff;
                  font-weight: 700;
                  font-size: 14px;
                  display:flex;
                  align-items:center;
                  justify-content:center;
                  box-shadow: 0 10px 24px rgba(0,0,0,0.20);
                  border: 2px solid rgba(255,255,255,0.8);
                ">${count}</div>`,
              });
            },
          })
        : L.layerGroup();

      pvzClusterRef.current = clusterGroup;
      clusterGroup.addTo(map);

      const allPoints = ensurePvzPoints();
      const markers: import("leaflet").Marker[] = [];

      // Create PVZ markers once; clustering will handle zoom-out aggregation.
      for (const point of allPoints) {
        pvzProviderByIdRef.current.set(point.id, point.provider);
        const isSelected = selectedFromUrl === point.id;

        const priceShort = (point.priceText || "")
          .replace(/^Стоимость\s*[—-]\s*/i, "")
          .trim();
        const deliveryShort = (point.deliveryText || "")
          .replace(/^Доставка\s*/i, "")
          .trim();
        const metaText = [priceShort, deliveryShort].filter(Boolean).join(", ");

        const marker = L.marker([point.lat, point.lon], {
          icon: getPvzMarkerIcon(L, point.provider, isSelected),
          keyboard: false,
          title: `${point.provider} — ${point.address}`,
        }).on("click", () => {
          selectPvzOnMap(point.id);
        });

        marker.bindPopup(
          `
            <div class="pvzPopupCard" role="dialog" aria-label="${point.provider}">
              <div class="pvzPopupText">
                <div class="pvzPopupTitle">${point.provider}</div>
                <div class="pvzPopupMeta">${metaText}</div>
              </div>
            </div>
          `,
          {
            closeButton: false,
            autoPan: true,
            autoPanPadding: [16, 16],
            className: "pvz-popup",
            offset: [0, -28],
          }
        );

        pvzMarkersRef.current.set(point.id, marker);

        markers.push(marker);
      }

      const clusterAny = clusterGroup as unknown as {
        addLayers?: (xs: unknown[]) => void;
        addLayer?: (x: unknown) => void;
      };

      if (clusterAny.addLayers) {
        clusterAny.addLayers(markers as unknown as unknown[]);
      } else if (clusterAny.addLayer) {
        for (const m of markers) clusterAny.addLayer(m);
      } else {
        for (const m of markers) m.addTo(clusterGroup);
      }

      // Do not add any non-PVZ marker when coming from Search.

      if (hasSelectedPvz && selectedFromUrl) {
        openPvzPopup(selectedFromUrl);
      }
    };

    void init();

    return () => {
      cancelled = true;
    };
  }, [
    step,
    searchParamsKey,
    destroyMap,
    ensurePvzIndex,
    ensurePvzPoints,
    getPvzMarkerIcon,
    openPvzPopup,
    selectPvzOnMap,
  ]);

  useEffect(() => {
    if (step !== "map") return;
    const L = leafletRef.current;
    if (!L) return;

    const prev = prevSelectedPvzIdRef.current;
    if (prev && prev !== selectedPvzId) {
      const prevMarker = pvzMarkersRef.current.get(prev);
      const prevProvider = pvzProviderByIdRef.current.get(prev);
      if (prevMarker && prevProvider) {
        try {
          prevMarker.setIcon(getPvzMarkerIcon(L, prevProvider, false));
        } catch {
          // ignore
        }
      }
    }

    if (selectedPvzId) {
      const marker = pvzMarkersRef.current.get(selectedPvzId);
      const provider = pvzProviderByIdRef.current.get(selectedPvzId);
      if (marker && provider) {
        try {
          marker.setIcon(getPvzMarkerIcon(L, provider, true));
        } catch {
          // ignore
        }
      }
    }

    prevSelectedPvzIdRef.current = selectedPvzId;
  }, [step, selectedPvzId, getPvzMarkerIcon]);

  useEffect(() => {
    if (step !== "map") return;

    if (isUserTracking) return;

    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    const params = new URLSearchParams(searchParamsKey);

    const selectedFromUrl = params.get("pvzId");
    const pvzIndex = ensurePvzIndex();
    const selectedPoint = selectedFromUrl
      ? pvzIndex.get(selectedFromUrl)
      : undefined;

    const urlLat = Number(params.get("lat"));
    const urlLon = Number(params.get("lon"));
    const urlHasCenter = Number.isFinite(urlLat) && Number.isFinite(urlLon);

    const centerLat = selectedPoint?.lat ?? (urlHasCenter ? urlLat : 55.751244);
    const centerLon = selectedPoint?.lon ?? (urlHasCenter ? urlLon : 37.618423);

    const hasMarker = !selectedPoint && urlHasCenter;
    const hasSelectedPvz = Boolean(selectedPoint);

    // UX: never auto-zoom-out, only zoom-in when needed.
    const desiredZoom = hasSelectedPvz ? 14 : hasMarker ? 12 : 10;
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();
    const eps = 1e-6;
    const needsMove =
      Math.abs(currentCenter.lat - centerLat) > eps ||
      Math.abs(currentCenter.lng - centerLon) > eps;
    const nextZoom = Math.max(currentZoom, desiredZoom);
    const needsZoomIn = currentZoom < nextZoom;

    if (needsMove || needsZoomIn) {
      map.setView([centerLat, centerLon], nextZoom, { animate: true });
    }

    // Do not add any non-PVZ marker when coming from Search.

    if (hasSelectedPvz && selectedFromUrl) {
      openPvzPopup(selectedFromUrl);
    }
  }, [ensurePvzIndex, openPvzPopup, step, searchParamsKey, isUserTracking]);

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
    const ProviderIcon = ({ provider }: { provider: PvzProvider }) => {
      if (provider === "CDEK") {
        return (
          <img src="/icons/global/CDEK.svg" alt="" width={16} height={16} />
        );
      }

      if (provider === "Boxberry") {
        return (
          <img src="/icons/global/boxberry.svg" alt="" width={16} height={16} />
        );
      }

      if (provider === "Яндекс Доставка") {
        return (
          <span className="text-white font-extrabold text-[14px] leading-none -translate-y-[0.5px]">
            Я
          </span>
        );
      }

      return (
        <span className="text-white font-extrabold text-[6px] leading-[1.05] uppercase text-center">
          Почта
          <br />
          России
        </span>
      );
    };

    const ProviderChips = (
      <div className="w-full">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            aria-pressed={activeProvider === "all"}
            onClick={() => setActiveProvider("all")}
            className={
              "shrink-0 h-10 px-3 rounded-full flex items-center gap-2 transition-colors border " +
              (activeProvider === "all"
                ? "bg-[#111111] text-white border-[#111111]"
                : "bg-white text-[#111111] border-[#E5E5E5]")
            }
          >
            <span className="w-7 h-7 rounded-full bg-[#111111] grid place-items-center border border-white/15">
              <span className="grid grid-cols-2 gap-0.5">
                <span className="w-[5px] h-[5px] rounded-full bg-white" />
                <span className="w-[5px] h-[5px] rounded-full bg-white" />
                <span className="w-[5px] h-[5px] rounded-full bg-white" />
                <span className="w-[5px] h-[5px] rounded-full bg-white" />
              </span>
            </span>
            <span className="text-[13px] font-semibold whitespace-nowrap">
              Все
            </span>
          </button>
          {PVZ_PROVIDERS.map((p) => {
            const isOn = activeProvider === p;
            return (
              <button
                key={p}
                type="button"
                aria-pressed={isOn}
                onClick={() => setActiveProvider(p)}
                className={
                  "shrink-0 h-10 px-3 rounded-full flex items-center gap-2 transition-colors border " +
                  (isOn
                    ? "bg-[#111111] text-white border-[#111111]"
                    : "bg-white text-[#111111] border-[#E5E5E5]")
                }
              >
                <span className="w-7 h-7 rounded-full bg-[#111111] grid place-items-center border border-white/15">
                  <ProviderIcon provider={p} />
                </span>
                <span className="text-[13px] font-semibold whitespace-nowrap">
                  {p === "Яндекс Доставка"
                    ? "Яндекс"
                    : p === "Почта России"
                    ? "Почта"
                    : p}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );

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
              "absolute right-4 bottom-44 z-1000 w-[46px] h-[46px] rounded-[50%] border border-[#E5E5E5] bg-white shadow-sm grid place-items-center transition-colors " +
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
          <div className="mb-3">{ProviderChips}</div>
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
        {filteredPvz.map((p, idx) => {
          const isActive = selectedPvzId === p.id;

          return (
            <button
              type="button"
              key={p.id}
              aria-pressed={isActive}
              onClick={() => {
                selectPvzOnMap(p.id);
              }}
              className={
                "w-full text-left px-4 py-4 transition-colors " +
                (isActive ? "bg-[#F4F3F1]" : "bg-white") +
                (idx === filteredPvz.length - 1
                  ? ""
                  : " border-b border-[#E5E5E5]")
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
          );
        })}

        {filteredPvz.length === 0 ? (
          <div className="px-4 py-6 text-[14px] text-[#7E7E7E]">
            Ничего не найдено
          </div>
        ) : null}
      </div>
    </div>
  );
}

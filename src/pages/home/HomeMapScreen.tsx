import { MapPin, Plus, User, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { loadNaverMapsScript } from "@/utils/loadNaverMaps";
import { BadgeDetailScreen } from "../badge/BadgeDetailScreen";
// import { fetchAllLocations } from "@/services/locationService";
import type { MapLocation } from "@/types/location";

interface Badge {
  id: number;
  name: string;
  location: { lat: number; lng: number };
  date: string;
  color: string;
  emoji: string;
  tags: string[];
}

interface HomeMapScreenProps {
  onNavigate: (screen: string) => void;
  userNickname: string;
  theme: "light" | "dark";
}

const MIN_SHEET_HEIGHT = 200;
const DEFAULT_MAX_HEIGHT = 600;

export function HomeMapScreen({ onNavigate, userNickname, theme }: HomeMapScreenProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [maxSheetHeight, setMaxSheetHeight] = useState(() =>
    typeof window !== "undefined" ? Math.min(window.innerHeight * 0.85, window.innerHeight - 120) : DEFAULT_MAX_HEIGHT
  );
  const [sheetHeight, setSheetHeight] = useState(MIN_SHEET_HEIGHT);
  const mapRef = useRef<HTMLDivElement>(null);
  const naverMapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const dragStartYRef = useRef<number | null>(null);
  const startHeightRef = useRef<number>(MIN_SHEET_HEIGHT);
  const isDraggingRef = useRef(false);

  const [locations] = useState<MapLocation[]>([
    {
      id: '1',
      name: '남산타워',
      type: 'festival',
      location: { lat: 37.5512, lng: 126.9882 },
      description: '서울의 대표적인 랜드마크',
      address: '서울특별시 용산구 남산공원길 105',
      date: '2024.11.14',
      imageUrl: '/penguin.png'
    }
  ]);
  const [isLoading] = useState(false);

  // API에서 데이터 가져오기 (주석처리)
  // useEffect(() => {
  //   const loadLocations = async () => {
  //     setIsLoading(true);
  //     try {
  //       const data = await fetchAllLocations();
  //       setLocations(data);
  //       console.log(`Loaded ${data.length} locations from Supabase`);
  //     } catch (error) {
  //       console.error('Error loading locations:', error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   loadLocations();
  // }, []);

  const [mapInitialized, setMapInitialized] = useState(false);

  // Load Naver Maps script and initialize map
  useEffect(() => {
    const initMap = async () => {
      try {
        // Load Naver Maps script
        await loadNaverMapsScript();

        if (!mapRef.current || !window.naver) return;

        // Seoul bounds (서울 지역 경계)
        const seoulBounds = new naver.maps.LatLngBounds(
          new naver.maps.LatLng(37.413294, 126.734086), // 남서 (Southwest)
          new naver.maps.LatLng(37.715133, 127.269311)  // 북동 (Northeast)
        );

        // Create map centered on Seoul
        const mapOptions: naver.maps.MapOptions = {
          center: new naver.maps.LatLng(37.5665, 126.9780), // Seoul City Hall
          zoom: 12,
          minZoom: 10,
          maxZoom: 17,
          bounds: seoulBounds,
          zoomControl: true,
          zoomControlOptions: {
            position: naver.maps.Position.TOP_RIGHT,
          },
          mapTypeControl: false,
          scaleControl: false,
          logoControl: false,
          mapDataControl: false,
          scrollWheel: true,
          draggable: true,
        };

        const map = new naver.maps.Map(mapRef.current, mapOptions);
        naverMapRef.current = map;

        // Set max bounds to restrict dragging to Seoul area
        map.setOptions({
          maxBounds: seoulBounds
        });

        // Mark map as initialized
        setMapInitialized(true);

        // Add bounds check on map movement to ensure user stays within Seoul
        const SEOUL_MIN_LAT = 37.413294;
        const SEOUL_MAX_LAT = 37.715133;
        const SEOUL_MIN_LNG = 126.734086;
        const SEOUL_MAX_LNG = 127.269311;

        naver.maps.Event.addListener(map, 'dragend', () => {
          const currentCenter = map.getCenter();
          const currentLat = currentCenter.y;
          const currentLng = currentCenter.x;

          // Check if current view is outside Seoul bounds
          if (
            currentLat < SEOUL_MIN_LAT ||
            currentLat > SEOUL_MAX_LAT ||
            currentLng < SEOUL_MIN_LNG ||
            currentLng > SEOUL_MAX_LNG
          ) {
            // Calculate the closest point within bounds
            const lat = Math.max(
              SEOUL_MIN_LAT,
              Math.min(SEOUL_MAX_LAT, currentLat)
            );
            const lng = Math.max(
              SEOUL_MIN_LNG,
              Math.min(SEOUL_MAX_LNG, currentLng)
            );

            // Move map back to valid position immediately
            map.setCenter(new naver.maps.LatLng(lat, lng));
          }
        });
      } catch (error) {
        console.error('Failed to load Naver Maps:', error);
      }
    };

    initMap();

    // Cleanup on unmount
    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      if (naverMapRef.current) {
        naverMapRef.current.destroy();
        naverMapRef.current = null;
      }
    };
  }, []);

  // Add markers when map is initialized and locations are loaded
  useEffect(() => {
    if (!mapInitialized || !naverMapRef.current || !window.naver || locations.length === 0) {
      console.log('Map not ready or no locations:', { mapInitialized, hasMap: !!naverMapRef.current, hasNaver: !!window.naver, locationsCount: locations.length });
      return;
    }

    const map = naverMapRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers for real locations
    const newMarkers = locations.map((location) => {
      // Determine marker style based on location type
      const isPaths = location.type === 'path';
      const markerColor = isPaths ? 'bg-green-500' : 'bg-orange-500';
      const markerIcon = isPaths ? '🚶' : '🎉';

      // Create custom HTML marker
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.innerHTML = `
        <div class="relative ${theme === "dark" ? "drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" : "drop-shadow-lg"}">
          <div class="${markerColor} w-12 h-12 rounded-xl flex flex-col items-center justify-center border-2 border-white/50 shadow-lg transform transition-all hover:scale-110 cursor-pointer">
            <span class="text-xl filter drop-shadow-sm">${markerIcon}</span>
          </div>
          <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full blur-sm ${theme === "dark" ? "bg-black/40" : "bg-black/20"}"></div>
        </div>
      `;

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(location.location.lat, location.location.lng),
        map: map,
        icon: {
          content: markerElement.outerHTML,
          anchor: new naver.maps.Point(24, 48),
        },
        clickable: true,
      });

      // Add click event to show location info and open modal
      naver.maps.Event.addListener(marker, 'click', () => {
        console.log('Selected location:', location);

        // Convert MapLocation to Badge format for modal
        const badge: Badge = {
          id: parseInt(location.id) || 1,
          name: location.name,
          location: location.location,
          date: location.date || new Date().toLocaleDateString('ko-KR'),
          color: location.type === 'path' ? 'green' : 'orange',
          emoji: location.type === 'path' ? '🚶' : '🎉',
          tags: [location.type === 'path' ? '산책로' : '축제']
        };

        setSelectedBadge(badge);
        setIsModalOpen(true);
      });

      return marker;
    });

    markersRef.current = newMarkers;
    console.log(`Added ${newMarkers.length} markers to map`);
  }, [mapInitialized, locations, theme, setSelectedBadge, setIsModalOpen]);

  useEffect(() => {
    const updateMaxHeight = () => {
      const height = Math.min(window.innerHeight * 0.85, window.innerHeight - 120);
      setMaxSheetHeight(height);
      setSheetHeight((prev) => Math.min(Math.max(prev, MIN_SHEET_HEIGHT), height));
    };
    updateMaxHeight();
    window.addEventListener("resize", updateMaxHeight);
    return () => window.removeEventListener("resize", updateMaxHeight);
  }, []);

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${
      theme === "dark" ? "bg-[#0a0e1a]" : "bg-white"
    }`}>
      {/* Top app bar */}
      <div className={`px-6 py-4 flex items-center justify-between border-b z-20 ${
        theme === "dark" 
          ? "border-slate-800 bg-[#0a0e1a]" 
          : "border-gray-200 bg-white"
      }`}>
        <div className="flex items-center gap-2">
          <MapPin className={`w-6 h-6 ${theme === "dark" ? "text-white" : "text-black"}`} strokeWidth={1.5} />
          <span className={`text-xl ${theme === "dark" ? "text-white" : "text-black"}`}>PinSeoul</span>
        </div>
        <button
          onClick={() => onNavigate("mypage")}
          className={`w-9 h-9 rounded-full flex items-center justify-center ${
            theme === "dark" ? "bg-white text-black" : "bg-black text-white"
          }`}
        >
          <User className="w-5 h-5" />
        </button>
      </div>

      {/* Map area */}
      <div className={`flex-1 relative ${theme === "dark" ? "bg-slate-900" : "bg-gray-50"}`}>
        {/* Naver Map Container */}
        <div id="map" ref={mapRef} className="absolute inset-0 w-full h-full" />

        {/* AI Recommendation banner */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className={`rounded-2xl p-3 flex items-center gap-3 shadow-sm border ${
            theme === "dark"
              ? "bg-slate-900/95 border-slate-700"
              : "bg-white border-gray-200"
          }`}>
            <Sparkles className="w-5 h-5 text-[#FF6B35] flex-shrink-0" strokeWidth={1.5} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${theme === "dark" ? "text-white" : "text-black"}`}>
                AI 추천: 오늘은 <span className="font-medium">'망원 한강공원'</span> 어때요?
              </p>
            </div>
            <button
              onClick={() => onNavigate("ai-recommend")}
              className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-colors ${
                theme === "dark"
                  ? "bg-slate-800 hover:bg-slate-700 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-black"
              }`}
            >
              보기
            </button>
          </div>
        </div>

        {/* Floating action button */}
        <button
          onClick={() => onNavigate("create-badge")}
          className="absolute bottom-24 right-6 w-14 h-14 rounded-full bg-[#FF6B35] shadow-sm flex items-center justify-center group hover:bg-[#E55A2B] transition-all duration-200"
        >
          <Plus className="w-7 h-7 text-white group-hover:rotate-90 transition-transform duration-300" strokeWidth={1.5} />
        </button>
      </div>

      {/* Bottom sheet with recent badges */}
      <div
        className={`relative rounded-t-3xl border-t-2 shadow-2xl transition-all duration-200 ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-gray-200"
        }`}
        style={{ height: `${sheetHeight}px` }}
      >
        {/* Drag handle */}
        <button
          onClick={() =>
            setSheetHeight((current) =>
              current <= (MIN_SHEET_HEIGHT + maxSheetHeight) / 2 ? maxSheetHeight : MIN_SHEET_HEIGHT
            )
          }
          onPointerDown={(event) => {
            dragStartYRef.current = event.clientY;
            startHeightRef.current = sheetHeight;
            isDraggingRef.current = true;
            const handlePointerMove = (moveEvent: PointerEvent) => {
              if (!isDraggingRef.current || dragStartYRef.current === null) return;
              const delta = dragStartYRef.current - moveEvent.clientY;
              const nextHeight = Math.min(
                Math.max(startHeightRef.current + delta, MIN_SHEET_HEIGHT),
                maxSheetHeight
              );
              setSheetHeight(nextHeight);
            };
            const handlePointerUp = () => {
              isDraggingRef.current = false;
              dragStartYRef.current = null;
              window.removeEventListener("pointermove", handlePointerMove);
              window.removeEventListener("pointerup", handlePointerUp);
              setSheetHeight((current) =>
                current < (MIN_SHEET_HEIGHT + maxSheetHeight) / 2 ? MIN_SHEET_HEIGHT : maxSheetHeight
              );
            };
            window.addEventListener("pointermove", handlePointerMove);
            window.addEventListener("pointerup", handlePointerUp);
          }}
          className="w-full py-3 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
        >
          <div
            className={`w-12 h-1 rounded-full ${
              theme === "dark" ? "bg-slate-600" : "bg-gray-300"
            } transition-colors`}
          />
        </button>

        {/* Sheet header */}
        <div className="px-6 pb-3 flex items-center justify-between">
          <h3 className={theme === "dark" ? "text-white" : "text-black"}>서울 명소</h3>
          <span className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
            {isLoading ? '로딩 중...' : `${locations.length}개`}
          </span>
        </div>

        {/* Location list */}
        <div className="px-6 pb-6 space-y-3 overflow-y-auto"
          style={{ maxHeight: `${Math.max(sheetHeight - 140, 120)}px` }}
          >
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                데이터를 불러오는 중...
              </div>
            </div>
          ) : locations.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                데이터가 없습니다
              </div>
            </div>
          ) : locations.length > 0 ? (
            <div
              key={locations[0].id}
              onClick={() => {
                const firstLocation = locations[0];

                // Convert MapLocation to Badge format for modal
                const badge: Badge = {
                  id: parseInt(firstLocation.id) || 1,
                  name: firstLocation.name,
                  location: firstLocation.location,
                  date: firstLocation.date || new Date().toLocaleDateString('ko-KR'),
                  color: firstLocation.type === 'path' ? 'green' : 'orange',
                  emoji: firstLocation.type === 'path' ? '🚶' : '🎉',
                  tags: [firstLocation.type === 'path' ? '산책로' : '축제']
                };

                setSelectedBadge(badge);
                setIsModalOpen(true);

                if (naverMapRef.current) {
                  naverMapRef.current.setCenter(
                    new naver.maps.LatLng(firstLocation.location.lat, firstLocation.location.lng)
                  );
                  naverMapRef.current.setZoom(15);
                }
              }}
              className={`w-full rounded-xl p-3 flex items-center gap-3 transition-colors border cursor-pointer ${
                theme === "dark"
                  ? "bg-slate-800/50 hover:bg-slate-800 border-slate-700"
                  : "bg-white hover:bg-gray-50 border-gray-200"
              }`}
            >
              {/* Location image */}
              <div className="w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden border-2 border-white/50 shadow-lg">
                <img
                  src="/penguin.png"
                  alt={locations[0].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className={`text-sm mb-1 truncate font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>
                  {locations[0].name}
                </p>
                <p className={`text-xs mb-1 truncate ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                  {locations[0].address || locations[0].description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    locations[0].type === 'path'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {locations[0].type === 'path' ? '산책로' : '축제'}
                  </span>
                  {locations[0].date && (
                    <span className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-gray-500"}`}>
                      {locations[0].date}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Badge Detail Modal */}
      <BadgeDetailScreen
        badge={selectedBadge}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBadge(null);
        }}
        theme={theme}
      />
    </div>
  );
}

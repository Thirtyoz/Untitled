import { MapPin, Plus, User, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { loadNaverMapsScript } from "@/utils/loadNaverMaps";
import { BadgeDetailScreen } from "../badge/BadgeDetailScreen";

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

const MOCK_BADGES: Badge[] = [
  {
    id: 1,
    name: "망원 한강공원",
    location: { lat: 37.5518, lng: 126.8947 }, // Mangwon Hangang Park (실제 좌표)
    date: "2024.03.15",
    color: "bg-amber-400",
    emoji: "🌅",
    tags: ["#한강", "#일몰"],
  },
  {
    id: 2,
    name: "북촌 한옥마을",
    location: { lat: 37.5825, lng: 126.9834 }, // Bukchon Hanok Village (실제 좌표)
    date: "2024.03.10",
    color: "bg-rose-400",
    emoji: "🏠",
    tags: ["#한옥", "#전통"],
  },
  {
    id: 3,
    name: "성수 카페거리",
    location: { lat: 37.5447, lng: 127.0557 }, // Seongsu Cafe Street (실제 좌표)
    date: "2024.03.08",
    color: "bg-teal-400",
    emoji: "☕",
    tags: ["#카페", "#힙지로"],
  },
  {
    id: 4,
    name: "남산타워",
    location: { lat: 37.5512, lng: 126.9882 }, // N Seoul Tower (실제 좌표)
    date: "2024.03.05",
    color: "bg-purple-400",
    emoji: "🗼",
    tags: ["#야경", "#랜드마크"],
  },
  {
    id: 5,
    name: "이태원 경리단길",
    location: { lat: 37.5340, lng: 126.9947 }, // Gyeongnidan-gil, Itaewon (실제 좌표)
    date: "2024.03.01",
    color: "bg-blue-400",
    emoji: "🍜",
    tags: ["#맛집", "#다이닝"],
  },
];

export function HomeMapScreen({ onNavigate, userNickname, theme }: HomeMapScreenProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const naverMapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);

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

        console.log(map);
        // Set max bounds to restrict dragging to Seoul area
        map.setOptions({
          maxBounds: seoulBounds
        });

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

        // Add markers for each badge
        const newMarkers = MOCK_BADGES.map((badge) => {
          // Create custom HTML marker
          const markerElement = document.createElement('div');
          markerElement.className = 'custom-marker';
          markerElement.innerHTML = `
            <div class="relative ${theme === "dark" ? "drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" : "drop-shadow-lg"}">
              <div class="${badge.color} w-16 h-16 rounded-2xl flex flex-col items-center justify-center border-2 border-white/50 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.3)] transform transition-all hover:rotate-2 hover:scale-110 cursor-pointer">
                <span class="text-2xl filter drop-shadow-sm">${badge.emoji}</span>
              </div>
              <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2 rounded-full blur-sm ${theme === "dark" ? "bg-black/40" : "bg-black/20"}"></div>
            </div>
          `;

          const marker = new naver.maps.Marker({
            position: new naver.maps.LatLng(badge.location.lat, badge.location.lng),
            map: map,
            icon: {
              content: markerElement.outerHTML,
              anchor: new naver.maps.Point(32, 64),
            },
            clickable: true,
          });

          // Add click event
          naver.maps.Event.addListener(marker, 'click', () => {
            setSelectedBadge(badge);
            setIsModalOpen(true);
          });

          return marker;
        });

        markersRef.current = newMarkers;
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
  }, [theme]);

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
        className={`relative rounded-t-3xl border-t-2 shadow-2xl transition-all duration-300 ${
          sheetExpanded ? "h-96" : "h-64"
        } ${
          theme === "dark"
            ? "bg-slate-900 border-slate-700"
            : "bg-white border-gray-200"
        }`}
      >
        {/* Drag handle */}
        <button
          onClick={() => setSheetExpanded(!sheetExpanded)}
          className="w-full py-3 flex items-center justify-center"
        >
          <div className={`w-12 h-1 rounded-full ${
            theme === "dark" ? "bg-slate-600" : "bg-gray-300"
          }`} />
        </button>

        {/* Sheet header */}
        <div className="px-6 pb-3 flex items-center justify-between">
          <h3 className={theme === "dark" ? "text-white" : "text-black"}>최근 수집한 배지</h3>
          <span className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>{MOCK_BADGES.length}개</span>
        </div>

        {/* Badge list */}
        <div className="px-6 pb-6 space-y-3 overflow-y-auto" style={{ maxHeight: sheetExpanded ? "280px" : "140px" }}>
          {MOCK_BADGES.map((badge) => (
            <div
              key={badge.id}
              onClick={() => {
                setSelectedBadge(badge);
                setIsModalOpen(true);
              }}
              className={`w-full rounded-xl p-3 flex items-center gap-3 transition-colors border cursor-pointer ${
                theme === "dark"
                  ? "bg-slate-800/50 hover:bg-slate-800 border-slate-700"
                  : "bg-white hover:bg-gray-50 border-gray-200"
              }`}
            >
              {/* Badge image */}
              <div className={`${badge.color} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 border-2 border-white/50 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,0.3)]`}>
                <span className="text-2xl">{badge.emoji}</span>
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className={`text-sm mb-1 truncate ${theme === "dark" ? "text-white" : "text-black"}`}>{badge.name}</p>
                <p className={`text-xs mb-1 ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>{badge.date}</p>
                <div className="flex gap-2 flex-wrap">
                  {badge.tags.map((tag) => (
                    <span key={tag} className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-gray-500"}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
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
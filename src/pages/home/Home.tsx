import { MapPin, Plus, User, Navigation } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { loadNaverMapsScript } from "@/utils/loadNaverMaps";
import { BadgeDetailScreen } from "../badge/BadgeDetailScreen";
import { PlaceDetailModal } from "./components/PlaceDetailModal";
import { FloatingPanel, type FloatingPanelRef, JumboTabs, Toast } from "antd-mobile";
import { fetchAllLocations } from "@/services/locationService";
import type { MapLocation } from "@/types/location";
import { HomeLoading } from "@/pages/home/Loading/HomeLoading";

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
  theme: "light" | "dark";
}

export function Home({ onNavigate, theme }: HomeMapScreenProps) {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaceModalOpen, setIsPlaceModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('my');
  const [panelHeight, setPanelHeight] = useState(320);
  const mapRef = useRef<HTMLDivElement>(null);
  const naverMapRef = useRef<naver.maps.Map | null>(null);
  const markersRef = useRef<naver.maps.Marker[]>([]);
  const floatingPanelRef = useRef<FloatingPanelRef>(null);

  const [locations, setLocations] = useState<MapLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 내 배지로 표시할 장소들 (conts_name 기준) - state로 관리
  const [myBadges, setMyBadges] = useState<string[]>(['창덕궁', '동대문디자인플라자(DDP)', '서울어린이대공원 음악분수']);

  // AI 추천 목록을 별도 state로 관리하여 리렌더링 시에도 유지
  const [aiRecommendations, setAiRecommendations] = useState<MapLocation[]>([]);

  // 탭에 따라 필터링된 장소 목록
  const filteredLocations = (() => {
    if (activeTab === 'my') {
      // 내 배지: myBadges에 포함된 장소만
      return locations.filter(location => myBadges.includes(location.contsName || ''));
    }
    if (activeTab === 'ai') {
      // AI 추천: 저장된 추천 목록 사용 (리렌더링 시에도 유지)
      return aiRecommendations;
    }
    if (activeTab === 'night') {
      // 야경: night_view_spots 테이블 데이터만
      return locations.filter(location => location.type === 'night_view');
    }
    if (activeTab === 'autumn') {
      // 단풍길: dangil_paths 테이블 데이터만
      return locations.filter(location => location.type === 'path');
    }
    if (activeTab === 'festival') {
      // 축제: festivals 테이블 데이터만
      return locations.filter(location => location.type === 'festival');
    }
    return locations;
  })();

  // API에서 데이터 가져오기 (주석처리)
  useEffect(() => {
    const loadLocations = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllLocations();
        setLocations(data);
        console.log(`Loaded ${data.length} locations from Supabase`);
      } catch (error) {
        console.error('Error loading locations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLocations();
  }, []);

  const [mapInitialized, setMapInitialized] = useState(false);

  // activeTab이 'ai'로 변경될 때만 새로운 AI 추천 생성
  useEffect(() => {
    if (activeTab === 'ai' && locations.length > 0) {
      // 새로운 랜덤 추천 생성
      const shuffled = [...locations].sort(() => Math.random() - 0.5);
      setAiRecommendations(shuffled.slice(0, 40));
      console.log('Generated new AI recommendations:', shuffled.slice(0, 40).length, 'items');
    }
  }, [activeTab, locations]);

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
          zoomControl: false,
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

  // Remove default NAVER logo overlay
  useEffect(() => {
    if (!mapInitialized || !mapRef.current) return;

    const hideLogo = () => {
      const logoAnchor = mapRef.current?.querySelector<HTMLAnchorElement>('a[href*="legal.html"]');
      logoAnchor?.parentElement?.remove();
    };

    hideLogo();

    const observer = new MutationObserver(() => hideLogo());
    observer.observe(mapRef.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [mapInitialized]);

  // Add markers when map is initialized and locations are loaded
  useEffect(() => {
    if (!mapInitialized || !naverMapRef.current || !window.naver || filteredLocations.length === 0) {
      console.log('Map not ready or no locations:', { mapInitialized, hasMap: !!naverMapRef.current, hasNaver: !!window.naver, locationsCount: filteredLocations.length });
      return;
    }

    const map = naverMapRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers for filtered locations
    const newMarkers = filteredLocations.map((location) => {
      // Check if this is one of the 내 배지 locations with custom image
      let badgeImageUrl = '';
      if (activeTab === 'my') {
        if (location.contsName?.includes('어린이대공원')) {
          badgeImageUrl = '/penguin.png';
        } else if (location.contsName?.includes('동대문디자인플라자') || location.contsName === 'DDP') {
          badgeImageUrl = '/ddp.png';
        } else if (location.contsName?.includes('창덕궁')) {
          badgeImageUrl = '/changduck.png';
        }
      }

      // Determine marker style based on location type
      let markerColor = 'bg-orange-500';
      let markerIcon = '🎉';

      if (location.type === 'path') {
        markerColor = 'bg-green-500';
        markerIcon = '🚶';
      } else if (location.type === 'night_view') {
        markerColor = 'bg-purple-500';
        markerIcon = '🌙';
      }

      // Create custom HTML marker
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';

      if (badgeImageUrl) {
        // Use image marker for 내 배지
        markerElement.innerHTML = `
          <div class="relative ${theme === "dark" ? "drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" : "drop-shadow-lg"}">
            <div class="bg-white w-12 h-12 rounded-xl flex items-center justify-center border-2 border-white/50 shadow-lg transform transition-all hover:scale-110 cursor-pointer overflow-hidden">
              <img src="${badgeImageUrl}" alt="badge" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full blur-sm ${theme === "dark" ? "bg-black/40" : "bg-black/20"}"></div>
          </div>
        `;
      } else {
        // Use emoji marker for others
        markerElement.innerHTML = `
          <div class="relative ${theme === "dark" ? "drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]" : "drop-shadow-lg"}">
            <div class="${markerColor} w-12 h-12 rounded-xl flex flex-col items-center justify-center border-2 border-white/50 shadow-lg transform transition-all hover:scale-110 cursor-pointer">
              <span class="text-xl filter drop-shadow-sm">${markerIcon}</span>
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full blur-sm ${theme === "dark" ? "bg-black/40" : "bg-black/20"}"></div>
          </div>
        `;
      }

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
        let badgeColor = 'orange';
        let badgeEmoji = '🎉';
        let badgeTag = '축제';

        if (location.type === 'path') {
          badgeColor = 'green';
          badgeEmoji = '🚶';
          badgeTag = '산책로';
        } else if (location.type === 'night_view') {
          badgeColor = 'purple';
          badgeEmoji = '🌙';
          badgeTag = '야경';
        }

        const badge: Badge = {
          id: parseInt(location.id) || 1,
          name: location.name,
          location: location.location,
          date: location.date || new Date().toLocaleDateString('ko-KR'),
          color: badgeColor,
          emoji: badgeEmoji,
          tags: [badgeTag]
        };

        setSelectedBadge(badge);
        setSelectedLocation(location);

        // myBadges에 있는지 확인하여 다른 모달 열기
        const isMyBadge = myBadges.includes(location.contsName || '');
        if (isMyBadge) {
          setIsModalOpen(true);
        } else {
          setIsPlaceModalOpen(true);
        }
      });

      return marker;
    });

    markersRef.current = newMarkers;
  }, [mapInitialized, filteredLocations, theme, myBadges]);

  useEffect(() => {
    floatingPanelRef.current?.setHeight(320, { immediate: true });
  }, []);

  // 내 위치로 이동하는 함수
  const handleMoveToMyLocation = () => {
    if (navigator.geolocation && naverMapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log(latitude,longitude)

          // 서울 경계 체크
          const SEOUL_MIN_LAT = 37.413294;
          const SEOUL_MAX_LAT = 37.715133;
          const SEOUL_MIN_LNG = 126.734086;
          const SEOUL_MAX_LNG = 127.269311;

          // 현재 위치가 서울 경계 내에 있는지 확인
          const isInSeoul =
            latitude >= SEOUL_MIN_LAT &&
            latitude <= SEOUL_MAX_LAT &&
            longitude >= SEOUL_MIN_LNG &&
            longitude <= SEOUL_MAX_LNG;

          console.log(isInSeoul)

          if (!isInSeoul) {
            Toast.show({
              content: <div style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>서울시 내에서만 이용이 가능합니다</div>,
              position: 'top',
              icon: 'fail',
              duration: 2000,
              getContainer: () => document.body,
            })
            return;
          }

          naverMapRef.current?.setCenter(new naver.maps.LatLng(latitude, longitude));
          naverMapRef.current?.setZoom(15);
        },
        (error) => {
          console.error('Error getting location:', error);
          Toast.show({
            content: <div style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>위치 정보를 가져올 수 없습니다</div>,
            position: 'top',
            icon: 'fail',
            duration: 2000,
            getContainer: () => document.body,
          })
        }
      );
    }
  };

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

        {/* Category Tabs */}
        <div className="absolute top-4 left-0 right-0 z-10">
          <JumboTabs
            activeKey={activeTab}
            onChange={(key: string) => setActiveTab(key)}
            className="category-tabs"
          >
            <JumboTabs.Tab title="내 배지" description="" key="my" />
            <JumboTabs.Tab title="AI추천" description="" key="ai" />
            <JumboTabs.Tab title="야경" description="" key="night" />
            <JumboTabs.Tab title="단풍길" description="" key="autumn" />
            <JumboTabs.Tab title="축제" description="" key="festival" />
          </JumboTabs>
        </div>

        {/* My Location button - FloatingPanel 위에 동적으로 위치 */}
        <button
          onClick={handleMoveToMyLocation}
          style={{
            bottom: `${panelHeight + 16}px`,
            transition: 'bottom 0s'
          }}
          className={`absolute right-6 w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 z-40 ${
            theme === "dark" ? "bg-slate-800 text-white hover:bg-slate-700 active:bg-slate-900" : "bg-white text-black hover:bg-gray-50 active:bg-gray-100"
          }`}
        >
          <Navigation className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {/* Floating action button */}
        {/* <button
          onClick={() => onNavigate("create-badge")}
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-[#FF6B35] shadow-sm flex items-center justify-center group hover:bg-[#E55A2B] transition-all duration-200 z-10"
        >
          <Plus className="w-7 h-7 text-white group-hover:rotate-90 transition-transform duration-300" strokeWidth={1.5} />
        </button> */}

        {/* FloatingPanel with location list */}
        <FloatingPanel
          ref={floatingPanelRef}
          anchors={[120, 320, window.innerHeight - 80]}
          className={theme === "dark" ? "floating-panel-dark" : "floating-panel-light"}
          onHeightChange={(height) => {
            setPanelHeight(height);
          }}
        >

          <div className={`px-6 pb-3 flex items-center justify-between ${
            theme === "dark" ? "text-white" : "text-black"
          }`}>
            <h3>
              {activeTab === 'my' ? '내 배지' :
               activeTab === 'ai' ? 'AI추천' :
               activeTab === 'night' ? '야경' :
               activeTab === 'autumn' ? '단풍길' :
               activeTab === 'festival' ? '축제' : '서울 명소'}
            </h3>
            {isLoading ? (
              <div className={`h-5 w-12 rounded animate-pulse ${
                theme === "dark" ? "bg-slate-700" : "bg-gray-200"
              }`} />
            ) : (
              <span className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                {filteredLocations.length}개
              </span>
            )}
          </div>

          {/* Location list */}
          <div className="px-6 pb-6 space-y-3 overflow-y-auto" style={{ maxHeight: '60vh' }}>
            {isLoading ? (
              <HomeLoading theme={theme} count={5} />
            ) : filteredLocations.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className={`text-sm ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                  데이터가 없습니다
                </div>
              </div>
            ) : (
              filteredLocations.map((location) => (
                <div
                  key={location.id}
                  onClick={() => {
                    // Convert MapLocation to Badge format for modal
                    let badgeColor = 'orange';
                    let badgeEmoji = '🎉';
                    let badgeTag = '축제';

                    if (location.type === 'path') {
                      badgeColor = 'green';
                      badgeEmoji = '🚶';
                      badgeTag = '산책로';
                    } else if (location.type === 'night_view') {
                      badgeColor = 'purple';
                      badgeEmoji = '🌙';
                      badgeTag = '야경';
                    }

                    const badge: Badge = {
                      id: parseInt(location.id) || 1,
                      name: location.name,
                      location: location.location,
                      date: location.date || new Date().toLocaleDateString('ko-KR'),
                      color: badgeColor,
                      emoji: badgeEmoji,
                      tags: [badgeTag]
                    };

                    setSelectedBadge(badge);
                    setSelectedLocation(location);

                    // myBadges에 있는지 확인하여 다른 모달 열기
                    const isMyBadge = myBadges.includes(location.contsName || '');
                    if (isMyBadge) {
                      setIsModalOpen(true);
                    } else {
                      setIsPlaceModalOpen(true);
                    }

                    if (naverMapRef.current) {
                      naverMapRef.current.setCenter(
                        new naver.maps.LatLng(location.location.lat, location.location.lng)
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
                  <div className={`w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden shadow-lg ${
                    // 내 배지 탭이고 커스텀 이미지가 있는 경우 배경 흰색
                    activeTab === 'my' && (location.contsName?.includes('어린이대공원') || location.contsName?.includes('동대문디자인플라자') || location.contsName?.includes('창덕궁'))
                      ? 'bg-white'
                      : location.type === 'path'
                      ? 'bg-gradient-to-br from-green-400 to-green-600'
                      : location.type === 'night_view'
                      ? 'bg-gradient-to-br from-purple-400 to-purple-600'
                      : 'bg-gradient-to-br from-orange-400 to-orange-600'
                  }`}>
                    {(() => {
                      if (activeTab === 'my') {
                        if (location.contsName?.includes('어린이대공원')) {
                          return <img src="/penguin.png" alt={location.name} className="w-full h-full object-cover" />;
                        } else if (location.contsName?.includes('동대문디자인플라자') || location.contsName === 'DDP') {
                          return <img src="/ddp.png" alt={location.name} className="w-full h-full object-cover" />;
                        } else if (location.contsName?.includes('창덕궁')) {
                          return <img src="/changduck.png" alt={location.name} className="w-full h-full object-cover" />;
                        }
                      }
                      return (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl filter drop-shadow-sm">
                            {location.type === 'path' ? '🚶' : location.type === 'night_view' ? '🌙' : '🎉'}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className={`text-sm mb-1 truncate font-medium ${theme === "dark" ? "text-white" : "text-black"}`}>
                      {location.name}
                    </p>
                    <p className={`text-xs mb-1 truncate ${theme === "dark" ? "text-slate-400" : "text-gray-600"}`}>
                      {location.address || location.description}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        location.type === 'path'
                          ? 'bg-green-500/20 text-green-400'
                          : location.type === 'night_view'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {location.type === 'path' ? '산책로' : location.type === 'night_view' ? '야경' : '축제'}
                      </span>
                      {location.date && (
                        <span className={`text-xs ${theme === "dark" ? "text-slate-500" : "text-gray-500"}`}>
                          {location.date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </FloatingPanel>
      </div>

      {/* Badge Detail Modal (내 배지용) */}
      <BadgeDetailScreen
        badge={selectedBadge}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBadge(null);
        }}
        theme={theme}
      />

      {/* Place Detail Modal (일반 장소용) */}
      <PlaceDetailModal
        badge={selectedBadge}
        location={selectedLocation}
        isOpen={isPlaceModalOpen}
        onClose={() => {
          setIsPlaceModalOpen(false);
          setSelectedBadge(null);
          setSelectedLocation(null);
        }}
        onVerify={() => {
          setIsPlaceModalOpen(false);
          onNavigate("create-badge");
        }}
        theme={theme}
      />
    </div>
  );
}

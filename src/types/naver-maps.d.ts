declare namespace naver.maps {
  class Map {
    constructor(element: HTMLElement | string, options?: MapOptions);
    setCenter(center: LatLng | LatLngLiteral): void;
    getCenter(): LatLng;
    setZoom(zoom: number): void;
    setOptions(options: Partial<MapOptions>): void;
    setOptions(key: string, value: any): void;
    destroy(): void;
  }

  class LatLng {
    constructor(lat: number, lng: number);
  }

  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  class LatLngBounds {
    constructor(sw: LatLng | LatLngLiteral, ne: LatLng | LatLngLiteral);
  }

  interface MapOptions {
    center?: LatLng | LatLngLiteral;
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    bounds?: LatLngBounds;
    maxBounds?: LatLngBounds;
    zoomControl?: boolean;
    zoomControlOptions?: {
      position?: Position;
    };
    mapTypeControl?: boolean;
    scaleControl?: boolean;
    logoControl?: boolean;
    mapDataControl?: boolean;
    draggable?: boolean;
    pinchZoom?: boolean;
    scrollWheel?: boolean;
    keyboardShortcuts?: boolean;
    disableDoubleTapZoom?: boolean;
    disableDoubleClickZoom?: boolean;
    disableTwoFingerTapZoom?: boolean;
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    setPosition(position: LatLng | LatLngLiteral): void;
  }

  interface MarkerOptions {
    position: LatLng | LatLngLiteral;
    map?: Map;
    icon?: string | ImageIcon | HtmlIcon;
    title?: string;
    clickable?: boolean;
  }

  interface ImageIcon {
    url: string;
    size?: Size;
    scaledSize?: Size;
    origin?: Point;
    anchor?: Point;
  }

  interface HtmlIcon {
    content: string | HTMLElement;
    size?: Size;
    anchor?: Point;
  }

  class Size {
    constructor(width: number, height: number);
  }

  class Point {
    constructor(x: number, y: number);
  }

  enum Position {
    TOP_LEFT,
    TOP_CENTER,
    TOP_RIGHT,
    LEFT_CENTER,
    CENTER,
    RIGHT_CENTER,
    BOTTOM_LEFT,
    BOTTOM_CENTER,
    BOTTOM_RIGHT,
  }

  class Event {
    static addListener(
      target: any,
      eventName: string,
      listener: Function
    ): MapEventListener;
  }

  interface MapEventListener {
    remove(): void;
  }
}

declare namespace naver {}

interface Window {
  naver: typeof naver;
}

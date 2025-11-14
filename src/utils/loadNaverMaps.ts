/**
 * Dynamically loads the Naver Maps API script
 * Uses the client ID from environment variables
 */
export function loadNaverMapsScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (window.naver && window.naver.maps) {
      resolve();
      return;
    }

    const clientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;

    if (!clientId) {
      reject(new Error('VITE_NAVER_MAP_CLIENT_ID is not defined in environment variables'));
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;

    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Naver Maps script'));

    document.head.appendChild(script);
  });
}

// Type declaration for window.naver
declare global {
  interface Window {
    naver?: {
      maps?: unknown;
    };
  }
}

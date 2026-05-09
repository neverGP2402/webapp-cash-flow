// Device and location information utilities

export interface DeviceInfo {
  userAgent: string;
  platform: string;
  language: string;
  screenResolution: string;
  timezone: string;
}

export interface LocationInfo {
  ip: string;
  country?: string;
  city?: string;
  region?: string;
  isp?: string;
  timezone?: string;
}

export interface RequestMetadata {
  device_info: string;
  ip_address: string;
  origin: string;
  user_agent: string;
  location?: LocationInfo;
}

// Get device information
export function getDeviceInfo(): DeviceInfo {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

// Get current origin
export function getOrigin(): string {
  return window.location.origin;
}

// Get IP address using a free IP service
export async function getIpAddress(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Failed to get IP address:', error);
    // Fallback to a default or try alternative service
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.ip;
    } catch (fallbackError) {
      console.warn('Fallback IP detection failed:', fallbackError);
      return '127.0.0.1'; // Ultimate fallback
    }
  }
}

// Get detailed location information
export async function getLocationInfo(): Promise<LocationInfo | null> {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    return {
      ip: data.ip,
      country: data.country_name,
      city: data.city,
      region: data.region,
      isp: data.org,
      timezone: data.timezone,
    };
  } catch (error) {
    console.warn('Failed to get location info:', error);
    return null;
  }
}

// Get complete request metadata
export async function getRequestMetadata(): Promise<RequestMetadata> {
  const deviceInfo = getDeviceInfo();
  const origin = getOrigin();
  
  // Try to get detailed location first, fallback to IP only
  let locationInfo = await getLocationInfo();
  if (!locationInfo) {
    const ip = await getIpAddress();
    locationInfo = { ip };
  }

  return {
    device_info: `${deviceInfo.platform} - ${deviceInfo.screenResolution}`,
    ip_address: locationInfo.ip,
    origin,
    user_agent: deviceInfo.userAgent,
    location: locationInfo,
  };
}

// Cache location info to avoid repeated API calls
let cachedLocationInfo: LocationInfo | null = null;
let locationCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCachedLocationInfo(): Promise<LocationInfo | null> {
  const now = Date.now();
  
  // Return cached info if still valid
  if (cachedLocationInfo && (now - locationCacheTime) < CACHE_DURATION) {
    return cachedLocationInfo;
  }
  
  // Fetch new location info
  const locationInfo = await getLocationInfo();
  if (locationInfo) {
    cachedLocationInfo = locationInfo;
    locationCacheTime = now;
  }
  
  return locationInfo;
}

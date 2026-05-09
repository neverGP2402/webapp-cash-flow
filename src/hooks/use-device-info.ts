import { useState, useEffect } from 'react';
import { getCachedLocationInfo, getDeviceInfo, LocationInfo, DeviceInfo } from 'src/utils/device-info';

export interface UseDeviceInfoReturn {
  deviceInfo: DeviceInfo;
  locationInfo: LocationInfo | null;
  isLoading: boolean;
  error: string | null;
}

export function useDeviceInfo(): UseDeviceInfoReturn {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getDeviceInfo());
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLocationInfo = async () => {
      try {
        const location = await getCachedLocationInfo();
        setLocationInfo(location);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load location info');
      } finally {
        setIsLoading(false);
      }
    };

    loadLocationInfo();
  }, []);

  return {
    deviceInfo,
    locationInfo,
    isLoading,
    error,
  };
}

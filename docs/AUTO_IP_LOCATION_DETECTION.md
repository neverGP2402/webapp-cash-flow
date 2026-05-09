# Automatic IP & Location Detection

This application automatically detects and includes IP address, location, and device information in all authentication requests.

## How It Works

### 1. Device Info Detection
The system automatically collects:
- **User Agent**: Browser information
- **Platform**: Operating system
- **Language**: Browser language
- **Screen Resolution**: Display dimensions
- **Timezone**: User's timezone

### 2. IP & Location Detection
The system uses multiple fallback services to detect:
- **IP Address**: Using `ipify.org` (primary) and `ipapi.co` (fallback)
- **Location**: Country, city, region
- **ISP**: Internet service provider
- **Location-based timezone**

### 3. Automatic Headers
All API requests automatically include these headers:
```
X-Client-IP: 192.168.1.1
X-Origin: https://yourapp.com
X-User-Agent: Mozilla/5.0...
X-Device-Info: Windows - 1920x1080
X-Country: Vietnam
X-City: Ho Chi Minh City
X-Region: Ho Chi Minh
X-ISP: VNPT
```

### 4. Enhanced Login Payload
Login requests automatically include:
```typescript
{
  username: string;
  password: string;
  device_info: string;        // Auto-filled
  ip_address: string;         // Auto-filled
  origin: string;             // Auto-filled
  user_agent: string;         // Auto-filled
}
```

## Implementation Details

### Files Modified:
- `src/services/auth.service.ts` - Enhanced with automatic metadata
- `src/contexts/auth-context.tsx` - Simplified login call
- `src/utils/device-info.ts` - New utility for detection
- `src/hooks/use-device-info.ts` - Hook for accessing device info

### Caching Strategy:
- Location info is cached for 5 minutes to avoid repeated API calls
- Device info is collected once and reused

### Fallback Mechanism:
1. Primary IP service: `ipify.org`
2. Fallback IP service: `ipapi.co`
3. Ultimate fallback: `127.0.0.1`

## Usage

### In Authentication:
```typescript
// No manual IP/device info needed - it's automatic!
const result = await login(username, password);
```

### In Components:
```typescript
import { useDeviceInfo } from 'src/hooks/use-device-info';

function MyComponent() {
  const { deviceInfo, locationInfo, isLoading } = useDeviceInfo();
  
  if (isLoading) return <div>Loading location...</div>;
  
  return (
    <div>
      <p>Your IP: {locationInfo?.ip}</p>
      <p>Location: {locationInfo?.city}, {locationInfo?.country}</p>
      <p>Device: {deviceInfo.platform}</p>
    </div>
  );
}
```

## CORS Issues & Solutions

### Problem:
Custom headers like `X-Client-IP`, `X-Device-Info` can cause CORS errors if the backend doesn't explicitly allow them.

### Solution:
The system now has two modes:

1. **Safe Mode (Default)**: 
   - Metadata is included in request body only
   - No custom headers to avoid CORS
   - Works with any backend

2. **Enhanced Mode**:
   - Metadata in both body AND headers
   - Requires backend CORS configuration
   - Enable with `VITE_USE_CUSTOM_HEADERS=true`

### Backend CORS Configuration:
```javascript
// Example Express.js CORS setup
app.use(cors({
  origin: ['http://localhost:3039', 'http://172.25.240.50:3039'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Client-IP',
    'X-Origin', 
    'X-User-Agent',
    'X-Device-Info',
    'X-Country',
    'X-City',
    'X-Region',
    'X-ISP'
  ]
}));
```

## Privacy Considerations

- All data collection is passive (no user input required)
- Location data is approximate based on IP address
- Data is only sent to your own API, not third parties
- Users can block location detection via browser settings

## Error Handling

- If IP detection fails, the system continues with fallback values
- Network errors don't prevent authentication
- All errors are logged for debugging

## Testing

To test the functionality:
1. Open browser dev tools
2. Check Network tab for login requests
3. Verify headers contain X-Client-IP, X-Origin, etc.
4. Check request payload for auto-filled fields

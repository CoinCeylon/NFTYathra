// Location utilities for POV NFT verification

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TouristLocation {
  id: string;
  name: string;
  coordinates: Coordinates;
  radius: number; // Verification radius in km
}

export const touristLocationData: Record<string, TouristLocation> = {
  sigiriya: {
    id: 'sigiriya',
    name: 'Sigiriya',
    coordinates: { lat: 7.9570, lng: 80.7603 },
    radius: 2.0, // 2km radius for verification
  },
  kandy: {
    id: 'kandy',
    name: 'Temple of the Sacred Tooth Relic',
    coordinates: { lat: 7.2906, lng: 80.6337 },
    radius: 1.5, // 1.5km radius
  },
  galle: {
    id: 'galle',
    name: 'Galle Fort',
    coordinates: { lat: 6.0535, lng: 80.2210 },
    radius: 1.0, // 1km radius
  },
};

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Check if user is within verification radius of a location
export const isLocationVerified = (userLocation: Coordinates, locationId: string): boolean => {
  const location = touristLocationData[locationId];
  if (!location) return false;
  
  const distance = calculateDistance(userLocation, location.coordinates);
  return distance <= location.radius;
};

// Get user's current location using browser GPS
export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
};

// Mock location for demo purposes (for demo toggle in MintPOV)
export const getMockLocation = (locationId: string): Coordinates => {
  const location = touristLocationData[locationId];
  if (!location) {
    // Default to Sigiriya if location not found
    return { lat: 7.9570, lng: 80.7603 };
  }
  // Add small random offset to simulate real GPS
  const offset = 0.001; // ~100m offset
  return {
    lat: location.coordinates.lat + (Math.random() - 0.5) * offset,
    lng: location.coordinates.lng + (Math.random() - 0.5) * offset,
  };
}; 
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface MapViewProps {
  pickup: string;
  destination: string;
  onRouteCalculated: (info: { distance: string; duration: string } | null) => void;
  updateTrigger: number;
}

interface RouteInfo {
  distance: string;
  duration: string;
}

async function geocodeAddress(address: string, apiKey: string) {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${apiKey}`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const coords = data.features[0].geometry.coordinates;
      return {
        lon: coords[0],
        lat: coords[1],
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

// Helper function to calculate straight-line distance (fallback)
function calculateDistance(from: { lat: number; lon: number }, to: { lat: number; lon: number }): number {
  const R = 6371; // Earth's radius in km
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLon = (to.lon - from.lon) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Helper function to get route from Geoapify
async function getRoute(from: { lat: number; lon: number }, to: { lat: number; lon: number }, apiKey: string) {
  try {
    // Try routing API first
    const response = await fetch(
      `https://api.geoapify.com/v1/routing?waypoints=${from.lat},${from.lon}|${to.lat},${to.lon}&mode=drive&apiKey=${apiKey}`
    );
    const data = await response.json();

    console.log('Route API response:', data);

    // Check if we got a valid route
    if (data.features && data.features.length > 0) {
      const route = data.features[0];
      
      // Handle different geometry types
      let coordinates = [];
      if (route.geometry.type === "LineString") {
        coordinates = route.geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
      } else if (route.geometry.type === "MultiLineString") {
        coordinates = route.geometry.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]);
      }
      
      const distanceMeters = route.properties.distance;
      const distanceKm = (distanceMeters / 1000).toFixed(1);
      
      const durationSeconds = route.properties.time;
      const durationMinutes = Math.round(durationSeconds / 60);
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      
      let durationText = '';
      if (hours > 0) {
        durationText = `${hours}h ${minutes}m`;
      } else {
        durationText = `${minutes} min`;
      }

      return {
        coordinates,
        distance: `${distanceKm} km`,
        duration: durationText,
        isEstimated: false
      };
    } 
    
    // If routing fails (unconnected regions), create a straight line and estimate
    console.warn('Routing failed, using straight-line fallback');
    
    const distance = calculateDistance(from, to);
    const estimatedSpeed = 50; // km/h average
    const hours = distance / estimatedSpeed;
    const durationMinutes = Math.round(hours * 60);
    const hoursDisplay = Math.floor(durationMinutes / 60);
    const minutesDisplay = durationMinutes % 60;
    
    let durationText = '';
    if (hoursDisplay > 0) {
      durationText = `${hoursDisplay}h ${minutesDisplay}m`;
    } else {
      durationText = `${minutesDisplay} min`;
    }
    
    // Create a simple straight line between points
    const coordinates = [
      [from.lat, from.lon],
      [to.lat, to.lon]
    ];

    return {
      coordinates,
      distance: `${distance.toFixed(1)} km`,
      duration: durationText,
      isEstimated: true
    };
  } catch (error) {
    console.error('Routing error:', error);
    
    // Fallback to straight line on any error
    const distance = calculateDistance(from, to);
    const estimatedSpeed = 50;
    const hours = distance / estimatedSpeed;
    const durationMinutes = Math.round(hours * 60);
    const hoursDisplay = Math.floor(durationMinutes / 60);
    const minutesDisplay = durationMinutes % 60;
    
    let durationText = '';
    if (hoursDisplay > 0) {
      durationText = `${hoursDisplay}h ${minutesDisplay}m`;
    } else {
      durationText = `${minutesDisplay} min`;
    }
    
    return {
      coordinates: [[from.lat, from.lon], [to.lat, to.lon]],
      distance: `${distance.toFixed(1)} km`,
      duration: durationText,
      isEstimated: true
    };
  }
}

// Helper function for coordinate validation
const isValidCoordinate = (lat: number, lon: number): boolean => {
  return !isNaN(lat) && !isNaN(lon) && 
         lat >= -90 && lat <= 90 && 
         lon >= -180 && lon <= 180;
};

function MapView({ pickup, destination, onRouteCalculated, updateTrigger }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersLayer = useRef<any>(null);
  const routeLayer = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const isInitialized = useRef<boolean>(false);

  // When route is calculated in MapView, notify parent
  useEffect(() => {
    onRouteCalculated(routeInfo);
  }, [routeInfo, onRouteCalculated]);

  // Initialize Leaflet once
  useEffect(() => {
    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      isInitialized.current = true;
      initMap();
    };
    document.body.appendChild(script);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const initMap = useCallback(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const L = (window as any).L;
    if (!L) return;
    
    // Initialize map with minimal zoom
    const map = L.map(mapContainer.current).setView([6.5244, 3.3792], 10); // Lagos default

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Create layers for markers and route
    routeLayer.current = L.layerGroup().addTo(map);
    markersLayer.current = L.layerGroup().addTo(map);
    
    mapInstance.current = map;
    
    // Initial update if we have data
    if (pickup || destination) {
      updateMap();
    }
  }, []);

  // Memoize updateMap to prevent recreation on every render
  const updateMap = useCallback(async () => {
    if (!mapInstance.current || !isInitialized.current) {
      console.log('Map not ready yet');
      return;
    }

    const L = (window as any).L;
    if (!L) return;

    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

    if (!apiKey) {
      console.error('Geoapify API key not found');
      return;
    }

    // Don't attempt geocoding for very short/incomplete addresses
    if ((pickup && pickup.length < 3) || (destination && destination.length < 3)) {
      console.log('Address too short, skipping geocoding');
      if (markersLayer.current) markersLayer.current.clearLayers();
      if (routeLayer.current) routeLayer.current.clearLayers();
      setRouteInfo(null);
      return;
    }

    // Skip if both fields are empty
    if (!pickup && !destination) {
      if (markersLayer.current) markersLayer.current.clearLayers();
      if (routeLayer.current) routeLayer.current.clearLayers();
      setRouteInfo(null);
      return;
    }

    try {
      setLoading(true);
      setRouteInfo(null);

      // Clear existing markers and routes
      if (markersLayer.current) {
        markersLayer.current.clearLayers();
      }
      if (routeLayer.current) {
        routeLayer.current.clearLayers();
      }

      const markers: any[] = [];

      if (pickup && destination) {
        console.log('Geocoding:', { pickup, destination });
        
        // Geocode both pickup and destination
        const [pickupCoords, destCoords] = await Promise.all([
          geocodeAddress(pickup, apiKey),
          geocodeAddress(destination, apiKey)
        ]);

        console.log('Geocoding results:', { pickupCoords, destCoords });

        // Only proceed if BOTH coordinates are valid
        if (pickupCoords && destCoords && 
            isValidCoordinate(pickupCoords.lat, pickupCoords.lon) && 
            isValidCoordinate(destCoords.lat, destCoords.lon)) {
          
          console.log('Getting route...');
          // Get route from Geoapify
          const route = await getRoute(pickupCoords, destCoords, apiKey);

          if (route && route.coordinates && route.coordinates.length > 0) {
            console.log('Route found:', route);
            
            // IMPORTANT: Wait for map to be ready before adding polyline
            try {
              // Draw route line with different style for estimated routes
              const routeLine = L.polyline(route.coordinates, {
                color: route.isEstimated ? '#FF9800' : '#4285F4',
                weight: route.isEstimated ? 4 : 5,
                opacity: route.isEstimated ? 0.6 : 0.8,
                dashArray: route.isEstimated ? '10, 10' : undefined,
                smoothFactor: 1
              });
              
              // Make sure map is initialized and has valid bounds before adding layer
              if (routeLayer.current && mapInstance.current) {
                // Use setTimeout to ensure map is fully ready
                setTimeout(() => {
                  if (routeLayer.current) {
                    routeLayer.current.addLayer(routeLine);
                    console.log('✅ Route line added to map');
                  }
                }, 100);
              } else {
                console.error('❌ Map or routeLayer not ready');
              }

              // Set route info with estimation indicator
              setRouteInfo({
                distance: route.distance,
                duration: route.isEstimated ? `~${route.duration}` : route.duration
              });
            } catch (err) {
              console.error('Error adding route line:', err);
              // Still set route info even if line drawing fails
              setRouteInfo({
                distance: route.distance,
                duration: route.isEstimated ? `~${route.duration}` : route.duration
              });
            }
          } else {
            console.log('No route found');
          }
          
          // Add green marker for pickup
          const greenIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          
          const pickupMarker = L.marker([pickupCoords.lat, pickupCoords.lon], { icon: greenIcon })
            .bindPopup(`<b>Pickup:</b> ${pickup}`);
          
          markersLayer.current.addLayer(pickupMarker);
          markers.push(pickupCoords);

          // Add red marker for destination
          const redIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });
          
          const destMarker = L.marker([destCoords.lat, destCoords.lon], { icon: redIcon })
            .bindPopup(`<b>Destination:</b> ${destination}`);
          
          markersLayer.current.addLayer(destMarker);
          markers.push(destCoords);
        } else {
          console.log('Invalid coordinates, showing individual markers only');
          // Show individual markers if available
          if (pickupCoords && isValidCoordinate(pickupCoords.lat, pickupCoords.lon)) {
            const greenIcon = L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });
            
            const pickupMarker = L.marker([pickupCoords.lat, pickupCoords.lon], { icon: greenIcon })
              .bindPopup(`<b>Pickup:</b> ${pickup}`);
            
            markersLayer.current.addLayer(pickupMarker);
            markers.push(pickupCoords);
          }
          if (destCoords && isValidCoordinate(destCoords.lat, destCoords.lon)) {
            const redIcon = L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            });
            
            const destMarker = L.marker([destCoords.lat, destCoords.lon], { icon: redIcon })
              .bindPopup(`<b>Destination:</b> ${destination}`);
            
            markersLayer.current.addLayer(destMarker);
            markers.push(destCoords);
          }
        }
      } else if (pickup || destination) {
        // Show only one point if either is provided
        const location = pickup || destination;
        const coords = await geocodeAddress(location, apiKey);

        if (coords && isValidCoordinate(coords.lat, coords.lon)) {
          const blueIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });

          const marker = L.marker([coords.lat, coords.lon], { icon: blueIcon })
            .bindPopup(`<b>${pickup ? 'Pickup' : 'Destination'}:</b> ${location}`);
          
          markersLayer.current.addLayer(marker);
          markers.push(coords);
        }
      }

      // Fit map to show all markers
      if (markers.length > 0) {
        try {
          const validMarkers = markers.filter(marker => 
            marker && 
            isValidCoordinate(marker.lat, marker.lon)
          );

          if (validMarkers.length === 0) {
            console.warn('No valid markers to fit bounds');
            return;
          }

          if (validMarkers.length === 1) {
            // Single marker - just center on it
            mapInstance.current.setView([validMarkers[0].lat, validMarkers[0].lon], 13);
          } else {
            // Multiple markers - fit bounds with validation
            try {
              // Create bounds from valid coordinates
              const latLngs = validMarkers.map((m: any) => L.latLng(m.lat, m.lon));
              
              // Check if all markers are at essentially the same location (within 0.0001 degrees)
              const firstMarker = validMarkers[0];
              const allSameLocation = validMarkers.every(marker => 
                Math.abs(marker.lat - firstMarker.lat) < 0.0001 && 
                Math.abs(marker.lon - firstMarker.lon) < 0.0001
              );

              if (allSameLocation) {
                console.log('All markers at same location, using single view');
                mapInstance.current.setView([firstMarker.lat, firstMarker.lon], 13);
              } else {
                const bounds = L.latLngBounds(latLngs);
                
                // Double check bounds validity before fitting
                if (bounds && bounds.isValid && bounds.isValid()) {
                  mapInstance.current.fitBounds(bounds, { 
                    padding: [50, 50],
                    maxZoom: 15 
                  });
                } else {
                  // Fallback to center view
                  console.warn('Bounds invalid, using center view');
                  const centerLat = validMarkers.reduce((sum, m) => sum + m.lat, 0) / validMarkers.length;
                  const centerLon = validMarkers.reduce((sum, m) => sum + m.lon, 0) / validMarkers.length;
                  mapInstance.current.setView([centerLat, centerLon], 10);
                }
              }
            } catch (boundsError) {
              console.error('Bounds creation error:', boundsError);
              // Last resort fallback
              const centerLat = validMarkers.reduce((sum, m) => sum + m.lat, 0) / validMarkers.length;
              const centerLon = validMarkers.reduce((sum, m) => sum + m.lon, 0) / validMarkers.length;
              mapInstance.current.setView([centerLat, centerLon], 10);
            }
          }
        } catch (error) {
          console.error('Error fitting bounds:', error);
          if (markers.length > 0 && isValidCoordinate(markers[0].lat, markers[0].lon)) {
            mapInstance.current.setView([markers[0].lat, markers[0].lon], 10);
          }
        }
      }
    } catch (error) {
      console.error('Error generating map:', error);
    } finally {
      setLoading(false);
    }
  }, [pickup, destination]);

  // Manual update effect (immediate)
  useEffect(() => {
    if (mapInstance.current && updateTrigger && updateTrigger > 0) {
      console.log('🔄 Manual map update triggered');
      // Clear any pending auto-updates
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      updateMap();
    }
  }, [updateTrigger, updateMap]);

  // Auto-update effect (3-second delay)
  useEffect(() => {
    if (mapInstance.current && (pickup || destination)) {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      console.log('⏰ Auto-update scheduled in 3 seconds');
      updateTimeoutRef.current = setTimeout(() => {
        updateMap();
      }, 3000);
    }
    
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [pickup, destination, updateMap]);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
            <p className="text-gray-600">Calculating route...</p>
          </div>
        </div>
      )}
      {!loading && !pickup && !destination && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-gray-500 text-lg">📍 Enter pickup and destination</p>
            <p className="text-gray-400 text-sm mt-2">to view route on map</p>
          </div>
        </div>
      )}
      {routeInfo && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-[1000] border border-gray-200">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Distance</p>
              <p className="text-lg font-semibold text-gray-900">{routeInfo.distance}</p>
            </div>
            <div className="border-l border-gray-300 pl-4">
              <p className="text-xs text-gray-500 uppercase">Duration</p>
              <p className="text-lg font-semibold text-gray-900">{routeInfo.duration}</p>
            </div>
          </div>
          {routeInfo.duration.startsWith('~') && (
            <p className="text-xs text-orange-600 mt-2">⚠️ Estimated (no direct route available)</p>
          )}
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </div>
  );
}

export default MapView;
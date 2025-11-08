import React, { useEffect, useRef, useState } from 'react';

interface MapViewProps {
  pickup: string;
  destination: string;
   onRouteCalculated: (info: { distance: string; duration: string } | null) => void;
}

interface RouteInfo {
  distance: string;
  duration: string;
}

function MapView({ pickup, destination , onRouteCalculated}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersLayer = useRef<any>(null);
  const routeLayer = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
    // When route is calculated in MapView
  useEffect(() => {
    if (routeInfo) {
      onRouteCalculated(routeInfo); // Pass to parent
    }
  }, [routeInfo, onRouteCalculated]);

  useEffect(() => {
    // Load Leaflet CSS and JS
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = initMap;
    document.body.appendChild(script);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapInstance.current) {
      updateMap();
    }
  }, [pickup, destination]);

  const initMap = () => {
    if (!mapContainer.current || mapInstance.current) return;

    const L = (window as any).L;
    
    // Initialize map with minimal zoom
    const map = L.map(mapContainer.current).setView([0, 0], 2);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Create layers for markers and route
    routeLayer.current = L.layerGroup().addTo(map);
    markersLayer.current = L.layerGroup().addTo(map);
    
    mapInstance.current = map;
    updateMap();
  };

  const updateMap = async () => {
    if (!mapInstance.current) return;

    const L = (window as any).L;
    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

    if (!apiKey) {
      console.error('Geoapify API key not found');
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
        // Geocode both pickup and destination
        const pickupCoords = await geocodeAddress(pickup, apiKey);
        const destCoords = await geocodeAddress(destination, apiKey);

        if (pickupCoords && destCoords) {
          // Get route from Geoapify
          const route = await getRoute(pickupCoords, destCoords, apiKey);

          if (route) {
            // Draw route line
            const routeLine = L.polyline(route.coordinates, {
              color: '#4285F4',
              weight: 4,
              opacity: 0.7
            });
            routeLayer.current.addLayer(routeLine);

            // Set route info
            setRouteInfo({
              distance: route.distance,
              duration: route.duration
            });
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
        }
      } else if (pickup || destination) {
        // Show only one point if either is provided
        const location = pickup || destination;
        const coords = await geocodeAddress(location, apiKey);

        if (coords) {
          const greenIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          });

          const marker = L.marker([coords.lat, coords.lon], { icon: greenIcon })
            .bindPopup(`<b>${pickup ? 'Pickup' : 'Destination'}:</b> ${location}`);
          
          markersLayer.current.addLayer(marker);
          markers.push(coords);
        }
      }

      // Fit map to show all markers
      if (markers.length > 0) {
        const bounds = L.latLngBounds(markers.map((m: any) => [m.lat, m.lon]));
        mapInstance.current.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (error) {
      console.error('Error generating map:', error);
    } finally {
      setLoading(false);
    }
  };
console.log(routeInfo?.duration  , "time" , routeInfo?.distance)
  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <p className="text-gray-500">Loading map...</p>
        </div>
      )}
      {!loading && !pickup && !destination && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-gray-500">Enter locations to view map</p>
        </div>
      )}
      {routeInfo && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-4 z-10">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-gray-600">Distance</p>
              <p className="text-lg font-semibold">{routeInfo.distance}</p>
            </div>
            <div className="border-l pl-4">
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-lg font-semibold">{routeInfo.duration}</p>
            </div>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}

// Helper function to geocode an address using Geoapify
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

// Helper function to get route from Geoapify
async function getRoute(from: { lat: number; lon: number }, to: { lat: number; lon: number }, apiKey: string) {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/routing?waypoints=${from.lat},${from.lon}|${to.lat},${to.lon}&mode=drive&apiKey=${apiKey}`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const route = data.features[0];
      const coordinates = route.geometry.coordinates[0].map((coord: number[]) => [coord[1], coord[0]]);
      
      // Get distance in km
      const distanceMeters = route.properties.distance;
      const distanceKm = (distanceMeters / 1000).toFixed(1);
      
      // Get duration in minutes
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
        duration: durationText
      };
    }
    return null;
  } catch (error) {
    console.error('Routing error:', error);
    return null;
  }
}

export default MapView;
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  center: L.LatLngExpression;
  zoom?: number;
  darkMode?: boolean;
  className?: string;
}

const Map = ({ 
  center = [0, 0], 
  zoom = 13, 
  darkMode = false, 
  className = "" 
}: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      // Fix for container not being properly sized initially
      mapContainerRef.current.style.overflow = 'hidden';
      
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        preferCanvas: true,
      }).setView(center, zoom);

      // Add zoom control after map initialization
      L.control.zoom({ position: 'topright' }).addTo(mapRef.current);

      // Create initial tile layer
      tileLayerRef.current = L.tileLayer(
        darkMode 
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          noWrap: true
        }
      ).addTo(mapRef.current);

      // Create initial marker
      updateMarker();

      // Fix for map not properly sizing initially
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 0);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
        tileLayerRef.current = null;
      }
    };
  }, []);

  // Update marker position when center changes
  const updateMarker = () => {
    if (mapRef.current) {
      if (markerRef.current) {
        markerRef.current.setLatLng(center);
      } else {
        markerRef.current = L.marker(center)
          .addTo(mapRef.current)
          .bindPopup('Selected Location')
          .openPopup();
      }
    }
  };

  // Update map view when center or zoom changes
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(center, zoom);
      updateMarker();
      mapRef.current.invalidateSize(); // Fix for container resizing
    }
  }, [center, zoom]);

  // Update tile layer when dark mode changes
  useEffect(() => {
    if (mapRef.current && tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
      
      tileLayerRef.current = L.tileLayer(
        darkMode 
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          noWrap: true
        }
      ).addTo(mapRef.current);
      
      mapRef.current.invalidateSize(); // Fix for container resizing
    }
  }, [darkMode]);

  return (
    <div 
      ref={mapContainerRef}
      className={`h-full w-full ${className} `}
      style={{ position: 'sticky' }}
    />
  );
};

export default Map;
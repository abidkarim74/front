import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";

import "leaflet/dist/leaflet.css";

// Fix missing marker icons in Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const LocationMap: React.FC = () => {
  const [location, setLocation] = useState<LatLngExpression | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Latitude: ", latitude);
        console.log("Longtude: ", longitude);
        setLocation([latitude, longitude]);
      },
      (error) => {
        console.error("Error getting location:", error);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 9000 } // Improved accuracy settings
    );

    return () => navigator.geolocation.clearWatch(watchId); // Cleanup on unmount
  }, []);

  if (!location) return <div>Loading location...</div>;

  return (
    <MapContainer center={location} zoom={16} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={location} icon={customIcon}>
        <Popup>Your current location</Popup>
      </Marker>
      <RecenterMap location={location} />
    </MapContainer>
  );
};

// 🔄 Auto-center map when location changes
const RecenterMap: React.FC<{ location: LatLngExpression }> = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(location, map.getZoom(), { animate: true });
  }, [location, map]);
  return null;
};

export default LocationMap;

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

function RescueMap() {
  const [userLocation, setUserLocation] = useState([
  17.385,
  78.4867,
  ]);
  useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserLocation([
        position.coords.latitude,
        position.coords.longitude,
      ]);
    },
    (error) => {
      console.error("Location access denied:", error);
    }
  );
  }, []);
  return (
    <div>
      <h2>Live Rescue Map</h2>

      <MapContainer
        center={userLocation}
        zoom={13}
        scrollWheelZoom={true}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "24px",
        }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

    <Marker position={userLocation}>
        <Popup>
            Rescue report location detected here.
        </Popup>
    </Marker>
    
      </MapContainer>
    </div>
  );
}

export default RescueMap;
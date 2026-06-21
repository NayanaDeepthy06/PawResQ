import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

function LocationMarker({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}) {

  useMapEvents({

    click(e) {

      setLatitude(
        e.latlng.lat
      );

      setLongitude(
        e.latlng.lng
      );

    },

  });

  return latitude &&
    longitude ? (
    <Marker
      position={[
        latitude,
        longitude,
      ]}
    />
  ) : null;

}

function VolunteerLocationPicker({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}) {

  return (

    <MapContainer
      center={[
        17.385,
        78.4867,
      ]}
      zoom={11}
      style={{
        height: "350px",
        width: "100%",
        borderRadius: "16px",
      }}
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LocationMarker
        latitude={latitude}
        longitude={longitude}
        setLatitude={
          setLatitude
        }
        setLongitude={
          setLongitude
        }
      />

    </MapContainer>

  );

}

export default VolunteerLocationPicker;
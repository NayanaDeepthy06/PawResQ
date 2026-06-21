import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const orangeIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function getPriorityIcon(priorityLevel) {
  if (priorityLevel === "Emergency") {
    return redIcon;
  }

  if (priorityLevel === "Urgent") {
    return orangeIcon;
  }

  return greenIcon;
}

function LocationMarker({ setSelectedPosition }) {
  useMapEvents({
    click(e) {
      setSelectedPosition([
        e.latlng.lat,
        e.latlng.lng,
      ]);
    },
  });

  return null;
}

function RescueMap({
  selectedPosition,
  setSelectedPosition,
  setDetectedAddress,
  submittedReport,
}) {
  const [userLocation, setUserLocation] = useState([
    17.385,
    78.4867,
  ]);
  const [reports, setReports] = useState([]);
      async function fetchReports() {
      try {
        const response = await fetch(
          "https://pawresq-api.onrender.com/api/reports"
        );

        const data = await response.json();

        setReports(data.reports || []);
      } catch (error) {
        console.error(
          "Failed to fetch rescue reports:",
          error
        );
      }
    }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      (error) => {
        console.error(
          "Location access denied:",
          error
        );
      }
    );
  }, []);

    useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
  if (submittedReport) {
    fetchReports();
  }
  }, [submittedReport]);

  useEffect(() => {
  async function fetchAddress() {
    if (!selectedPosition) {
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${selectedPosition[0]}&lon=${selectedPosition[1]}`
      );

      const data = await response.json();

      if (data.display_name) {
        setDetectedAddress(data.display_name);
      }
    } catch (error) {
      console.error(
        "Failed to fetch address:",
        error
      );
    }
  }

  fetchAddress();
}, [selectedPosition]);

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
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationMarker
          setSelectedPosition={
            setSelectedPosition
          }
        />

        {selectedPosition && (
         <Marker
          position={selectedPosition}
            icon={blueIcon}
          >
            <Popup>
              Rescue location selected
            </Popup>
          </Marker>
        )}
        {reports
  .filter(
    (report) =>
      report.status !== "Rescued" &&
      report.status !== "Closed"
  )
  .map((report) => {
  if (!report.latitude || !report.longitude) {
    return null;
  }

  return (
          <Marker
          key={report._id}
          position={[
            Number(report.latitude),
            Number(report.longitude),
          ]}
          icon={getPriorityIcon(
            report.priorityLevel
          )}
        >
          <Popup>
            <div>
              <h3>{report.animalType}</h3>

              <p>
                {report.injuryDescription}
              </p>

              <p>
                Priority:
                {report.priorityLevel}
              </p>

              <p>
                Status:
                {report.status}
              </p>
            </div>
          </Popup>
        </Marker>
      );
    })}
      </MapContainer>
    </div>
  );
}

export default RescueMap;
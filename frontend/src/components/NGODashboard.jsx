import "./NGODashboard.css";
import socket from "../socket";
import { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaAmbulance,
  FaPaw,
  FaTimes,
} from "react-icons/fa";
function NGODashboard() {
const [reports, setReports] = useState([]);
const [selectedImage, setSelectedImage] = useState(null);
const [selectedReportId, setSelectedReportId,] = useState(null);
const [volunteerName,setVolunteerName,] = useState("");
const [volunteerPhone,setVolunteerPhone,] = useState(""); 
const [activeFilter, setActiveFilter] = useState("All");
const [searchTerm, setSearchTerm] =  useState("");
const [ nearbyAlert,  setNearbyAlert,] = useState(null);

  useEffect(() => {

  socket.on(
  "connect",
  () => {

    console.log(
      "Connected:",
      socket.id
    );

    const ngo =
      JSON.parse(
        localStorage.getItem(
          "ngoData"
        ) || "{}"
      );
      console.log(
        "NGO DATA:",
        ngo
      );

    if (ngo.id) {
      console.log(
        "JOINING ROOM:",
        ngo.id
      );

      socket.emit(
        "JOIN_NGO_ROOM",
        ngo.id
      );

    }

  }
);

  socket.on(
    "NEW_RESCUE_CASE",
    (newReport) => {

      console.log(
        "New Rescue Case:",
        newReport
      );

      setReports(
        (currentReports) => [
          newReport,
          ...currentReports,
        ]
      );

    }
  );

  socket.on(
    "CASE_ACCEPTED",
    (updatedReport) => {

      console.log(
        "CASE_ACCEPTED RECEIVED",
        updatedReport
      );

      setReports(
        (currentReports) =>
          currentReports.map(
            (report) =>
              report._id ===
              updatedReport._id
                ? updatedReport
                : report
          )
      );

    }
  );
  socket.on(
  "VOLUNTEER_ASSIGNED",
  (updatedReport) => {

    console.log(
      "VOLUNTEER_ASSIGNED RECEIVED",
      updatedReport
    );

    setReports(
      (currentReports) =>
        currentReports.map(
          (report) =>
            report._id ===
            updatedReport._id
              ? updatedReport
              : report
        )
    );

  }
);
socket.on(
  "CASE_RESCUED",
  (updatedReport) => {

    console.log(
      "CASE_RESCUED RECEIVED",
      updatedReport
    );

    setReports(
      (currentReports) =>
        currentReports.map(
          (report) =>
            report._id ===
            updatedReport._id
              ? updatedReport
              : report
        )
    );

  }
);
socket.on(
  "NEARBY_RESCUE_ALERT",
  (data) => {

    console.log(
      "🚨🚨🚨 ALERT RECEIVED 🚨🚨🚨"
    );

    console.log(data);

    setNearbyAlert(data);

  }
);


return () => {

  socket.off("connect");

  socket.off(
    "NEW_RESCUE_CASE"
  );

  socket.off(
    "CASE_ACCEPTED"
  );

  socket.off(
    "VOLUNTEER_ASSIGNED"
  );

  socket.off(
    "CASE_RESCUED"
  );

    socket.off(
  "NEARBY_RESCUE_ALERT"
);

    };
  }, []);

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch(
          "https://pawresq-api.onrender.com/api/reports"
        );

        const data = await response.json();

        setReports(data.reports || []);
      } catch (error) {
        console.error(
          "Failed to fetch reports:",
          error
        );
      }
    }

    fetchReports();
  }, []);

  useEffect(() => {

  if (!nearbyAlert) return;

  const timer =
    setTimeout(() => {

      setNearbyAlert(null);

    }, 15000);

  return () =>
    clearTimeout(timer);

}, [nearbyAlert]);

  
function getTimeAgo(timestamp) {

  if (!timestamp) {
    return "Just now";
  }

  const seconds =
    Math.floor(
      (new Date() - new Date(timestamp)) /
      1000
    );

  const minutes =
    Math.floor(seconds / 60);

  const hours =
    Math.floor(minutes / 60);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} mins ago`;
  }

  if (hours < 24) {
    return `${hours} hours ago`;
  }

  const days =
    Math.floor(hours / 24);

  return `${days} days ago`;
}

async function updateRescueStatus(
  reportId,
  newStatus
) {
  try {

    const response = await fetch(
      `https://pawresq-api.onrender.com/api/reports/${reportId}/status`,
      {
        method: "PATCH",

        headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${localStorage.getItem(
            "ngoToken"
          )}`,
      },

        body: JSON.stringify({
          status: newStatus,
        }),
      }
    );

    const data =
      await response.json();

    if (data.success) {

      setReports((prevReports) =>
        prevReports.map((report) =>
          report._id === reportId
            ? data.report
            : report
        )
      );
    }

  } catch (error) {

    console.error(
      "Failed to update rescue status:",
      error
    );
  }
}

async function acceptRescueCase(
  reportId
) {

  try {

    const ngo =
      JSON.parse(
        localStorage.getItem(
          "ngoData"
        )
      );

    const response =
      await fetch(
        `https://pawresq-api.onrender.com/api/reports/${reportId}/accept`,
        {
          method: "PATCH",

          headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${localStorage.getItem(
              "ngoToken"
            )}`,
        },

          body: JSON.stringify({
            ngoId: ngo.id,
            ngoName:
              ngo.ngoName,
          }),
        }
      );

    const data =
      await response.json();

    if (!response.ok) {

      alert(
        data.message
      );

      return;

    }

    setReports(
      (previousReports) =>
        previousReports.map(
          (report) =>
            report._id === reportId
              ? data.report
              : report
        )
    );

  } catch (error) {

    console.error(
      error
    );

    alert(
      "Failed to accept rescue"
    );

  }

}

async function assignVolunteer() {

  try {

    const response =
      await fetch(
        `https://pawresq-api.onrender.com/api/reports/${selectedReportId}/assign-volunteer`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            volunteerName,

            volunteerPhone,

          }),

        }
      );

    const data =
      await response.json();

    if (!response.ok) {

      alert(
        data.message
      );

      return;

    }

    setReports(
      (currentReports) =>
        currentReports.map(
          (report) =>
            report._id ===
            selectedReportId
              ? data.report
              : report
        )
    );

    setSelectedReportId(
      null
    );

    setVolunteerName("");

    setVolunteerPhone("");

  } catch (error) {

    console.error(error);

  }

}

const currentNGO =
  JSON.parse(
    localStorage.getItem(
      "ngoData"
    ) || "{}"
  );

  return (
    <section className="ngo-dashboard">
      
    {nearbyAlert && (

  <div className="nearby-alert-card">

    <button
      className="alert-close-btn"
      onClick={() =>
        setNearbyAlert(null)
      }
    >
      <FaTimes />
    </button>

    <h3 className="alert-title">
      Emergency Rescue Nearby
      </h3>

    <p>
      Animal:
      {" "}
      {
        nearbyAlert.report
          .animalType
      }
    </p>
    <p>
      <strong>Tracking ID:</strong>{" "}
      {nearbyAlert.report.trackingId}
    </p>

    <p>
      Severity:
      {" "}
      {
        nearbyAlert.report
          .severity
      }
    </p>

    <p>
      Distance:
      {" "}
      {
        nearbyAlert.distance
      } km
    </p>
      {nearbyAlert.report.imageUrl && (
    <img
      src={nearbyAlert.report.imageUrl}
      alt="Animal"
      className="alert-animal-image"
    />
  )}

    <p>
      Location:
      {" "}
      {
        nearbyAlert.report
          .location
      }
    </p>

    <button
      className="view-case-btn"
      onClick={() => {

        const caseElement =
          document.getElementById(
            nearbyAlert.report._id
          );

        if (caseElement) {

          caseElement.scrollIntoView({
            behavior:
              "smooth",
          });

        }

      }}
    >
      View Case
    </button>

  </div>

)}

      <div className="dashboard-header">
        <h2>
          NGO Rescue Operations Dashboard
        </h2>

        <p>
          Monitor active rescue cases and
          coordinate emergency response.
        </p>
      </div>
    <div className="dashboard-stats">

  <div className="dashboard-stat-card">
    <h3>
      {reports.length}
    </h3>

    <p>
      Total Rescue Cases
    </p>
  </div>

  <div className="dashboard-stat-card emergency-stat">
    <h3>
      {
        reports.filter(
          (report) =>
            report.priorityLevel ===
            "Emergency"
        ).length
      }
    </h3>

    <p>
      Emergency Cases
    </p>
  </div>

  <div className="dashboard-stat-card">
    <h3>
      {
        reports.filter(
          (report) =>
            report.status ===
            "Rescued"
        ).length
      }
    </h3>

    <p>
      Rescued Animals
    </p>
  </div>

</div>
     <div className="dashboard-search">

      <input
        type="text"
        placeholder="Search rescue cases..."
        value={searchTerm}
        onChange={(event) =>
          setSearchTerm(event.target.value)
        }
      />

    </div>
      <div className="dashboard-filters">

        <button
          className={
            activeFilter === "All"
              ? "active-filter"
              : ""
          }
          onClick={() =>
            setActiveFilter("All")
          }
        >
          All Cases
        </button>

        <button
          className={
            activeFilter === "Emergency"
              ? "active-filter"
              : ""
          }
          onClick={() =>
            setActiveFilter("Emergency")
          }
        >
          Emergency
        </button>

        <button
          className={
            activeFilter === "Active"
              ? "active-filter"
              : ""
          }
          onClick={() =>
            setActiveFilter("Active")
          }
        >
          Active Cases
        </button>

        <button
          className={
            activeFilter === "Rescued"
              ? "active-filter"
              : ""
          }
          onClick={() =>
            setActiveFilter("Rescued")
          }
        >
          Rescued
        </button>

      </div>
      <div className="dashboard-grid">

        <div className="rescue-cases-section">

          {[...reports]
          .filter((report) => {
            const searchValue =
                searchTerm.toLowerCase();

              const matchesSearch =
                report.animalType
                  ?.toLowerCase()
                  .includes(searchValue) ||

                report.location
                  ?.toLowerCase()
                  .includes(searchValue) ||

                report.injuryDescription
                  ?.toLowerCase()
                  .includes(searchValue) ||

                report.status
                  ?.toLowerCase()
                  .includes(searchValue);

              if (!matchesSearch) {
                return false;
              }

            if (activeFilter === "Emergency") {
              return (
                report.priorityLevel ===
                "Emergency"
              );
            }

            if (activeFilter === "Active") {
              return (
                report.status !==
                "Rescued"
              );
            }

            if (activeFilter === "Rescued") {
              return (
                report.status ===
                "Rescued"
              );
            }

            return true;
          })
          .sort((a, b) => {

          if (
            a.status === "Rescued" &&
            b.status !== "Rescued"
          ) {
            return 1;
          }

          if (
            a.status !== "Rescued" &&
            b.status === "Rescued"
          ) {
            return -1;
          }

          const priorityOrder = {
            Emergency: 1,
            Urgent: 2,
            Important: 3,
            Routine: 4,
          };

          return (
            priorityOrder[a.priorityLevel] -
            priorityOrder[b.priorityLevel]
          );
        })
           .map((report) => (
                <div
                  id={report._id}
                  key={report._id}
                  className={`rescue-case-card ${
                    report.priorityLevel === "Emergency"
                    ? "emergency-case"
                    : ""
                  }`}
                >
                  {report.imageUrl && (

                    <img
                      src={report.imageUrl}
                      alt={report.animalType}
                      className="animal-image"
                      onClick={() =>
                        setSelectedImage(
                          report.imageUrl
                        )
                      }
                    />

                  )}

                <div className="case-card-top">

                    <h3>
                    {report.animalType}
                    </h3>

                    <span
                    className={`priority-badge ${
                        report.priorityLevel.toLowerCase()
                    }`}
                    >
                    {report.priorityLevel}
                    </span>

                </div>

               <p className="case-location">
                  <FaMapMarkerAlt />
                  {" "}
                  {report.location}
                </p>

                <p className="case-description">
                    {report.injuryDescription}
                </p>

                <div className="ai-analysis-card">

  <h4>
    AI Analysis
  </h4>

  <p>
    <strong>Animal:</strong>
    {" "}
    {report.aiAnimal || "Not Available"}
  </p>

  <p>
    <strong>Confidence:</strong>
    {" "}
    {report.aiAnimalConfidence
      ? `${Math.round(
          report.aiAnimalConfidence * 100
        )}%`
      : "N/A"}
  </p>

  <p>
    <strong>Detected Injury:</strong>
    {" "}
    {report.aiInjury || "Not Available"}
  </p>

  <p>
    <strong>Injury Confidence:</strong>
    {" "}
    {report.aiInjuryConfidence
      ? `${Math.round(
          report.aiInjuryConfidence * 100
        )}%`
      : "N/A"}
  </p>

  <p>
    <strong>AI Severity:</strong>
    {" "}
    <span
      className={`ai-severity-badge ${
        report.aiSeverity?.toLowerCase()
      }`}
    >
      {report.aiSeverity || "N/A"}
    </span>
  </p>

</div>

              <div className="case-timeline">

                <p>
                  <FaClock />
                    {" "}
                    Reported:
                  {getTimeAgo(
                    report.createdAt
                  )}
                </p>

                {report.acceptedAt && (
                  <p>
                   <FaCheckCircle />
                    {" "}
                    Accepted:
                    {getTimeAgo(
                      report.acceptedAt
                    )}
                  </p>
                )}

                {report.volunteerAssignedAt && (
                  <p>
                   <FaAmbulance />
                      {" "}
                      Volunteer Assigned:
                    {getTimeAgo(
                      report.volunteerAssignedAt
                    )}
                  </p>
                )}

                {report.rescuedAt && (
                  <p>
                   <FaPaw />
                      {" "}
                      Rescued:
                    {getTimeAgo(
                      report.rescuedAt
                    )}
                  </p>
                )}

              </div>

            <div className="case-footer">

                <span
                  className={`status-badge ${
                    report.status === "Accepted"
                      ? "status-accepted"
                      : report.status ===
                        "Volunteer Assigned"
                      ? "status-volunteer"
                      : report.status ===
                        "Rescued"
                      ? "status-rescued"
                      : "status-pending"
                  }`}
                >
                  {report.status || "Pending"}
                </span>

                <span className="severity-text">
                    Severity:
                    {" "}
                    {report.severity}
                </span>
                {report.acceptedByNGO?.ngoName && (
                  <p className="accepted-ngo">

                    Accepted By:
                    {" "}
                    {
                      report.acceptedByNGO
                        .ngoName
                    }

                  </p>

                )}

                </div>

         <div className="ngo-action-buttons">

          {(report.status === "Pending" ||
            !report.status) && (
            <button
              className="accept-button"
              onClick={() =>
                acceptRescueCase(
                  report._id
                )
              }
            >
              Accept Rescue
            </button>
          )}

          {report.status === "Accepted" && (

            report.acceptedByNGO?.ngoId ===
            currentNGO?.id ? (

              <button
                className="assign-button"
                onClick={() => {
                setSelectedReportId(
                  report._id
                );

              }}
              >
                Assign Volunteer
              </button>

            ) : (

              <button
                className="assigned-button"
                disabled
              >
                Assigned To{" "}
                {
                  report.acceptedByNGO
                    ?.ngoName
                }
              </button>

            )
          )}

      {report.status ===
        "Volunteer Assigned" && (

        report.acceptedByNGO?.ngoId ===
        currentNGO?.id ? (

          <button
            className="rescue-button"
            onClick={() =>
              updateRescueStatus(
                report._id,
                "Rescued"
              )
            }
          >
            Mark Rescued
          </button>

        ) : (

          <button
            className="assigned-button"
            disabled
          >
            Assigned To{" "}
            {
              report.acceptedByNGO
                ?.ngoName
            }
          </button>

        )

      )}

          {report.status === "Rescued" && (
        <div className="completed-rescue">

          Rescue Completed
          <br />
          By{" "}
          {
            report.acceptedByNGO
              ?.ngoName
          }

        </div>
      )}
        </div>      
        </div>
             ))}

            </div>

         {selectedImage && (

  <div
    className="image-modal-overlay"
    onClick={() =>
      setSelectedImage(null)
    }
  >

    <div
      className="image-modal-content"
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      <button
        className="image-close-btn"
        onClick={() =>
          setSelectedImage(null)
        }
      >
        
       <FaTimes />
      </button>

      <img
        src={selectedImage}
        alt="Animal"
        className="full-animal-image"
      />

    </div>

  </div>

)}   

      </div>
      
  {selectedReportId && (

  <div className="assign-modal-overlay">

    <div className="assign-modal">

      <h2>
        Assign Volunteer
      </h2>

      <input
        type="text"
        placeholder="Volunteer Name"
        value={volunteerName}
        onChange={(e) =>
          setVolunteerName(
            e.target.value
          )
        }
      />

      <input
        type="text"
        placeholder="Volunteer Phone Number"
        value={volunteerPhone}
        onChange={(e) =>
          setVolunteerPhone(
            e.target.value
          )
        }
      />

      <div className="assign-modal-actions">

        <button
          className="assign-button"
          onClick={
            assignVolunteer
          }
        >
          Assign Volunteer
        </button>

        <button
          className="assigned-button"
          onClick={() => {

            setSelectedReportId(
              null
            );

            setVolunteerName("");

            setVolunteerPhone("");

          }}
        >
          Cancel
        </button>

      </div>

    </div>

  </div>

)}
    </section>
  );
}

export default NGODashboard;
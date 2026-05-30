import { useEffect, useState } from "react";

function NGODashboard() {
  const [reports, setReports] = useState([]);
  const [activeFilter, setActiveFilter] =
  useState("All");
const [searchTerm, setSearchTerm] =
  useState("");

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch(
          "http://localhost:5001/api/reports"
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
      `http://localhost:5001/api/reports/${reportId}/status`,
      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
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

  return (
    <section className="ngo-dashboard">

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
                key={report._id}
                className={`rescue-case-card ${
                    report.priorityLevel === "Emergency"
                    ? "emergency-case"
                    : ""
                }`}
                >

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
                    📍 {report.location}
                </p>

                <p className="case-description">
                    {report.injuryDescription}
                </p>
              <div className="case-timeline">

                <p>
                  🕒 Reported:
                  {" "}
                  {getTimeAgo(
                    report.createdAt
                  )}
                </p>

                {report.acceptedAt && (
                  <p>
                    ✅ Accepted:
                    {" "}
                    {getTimeAgo(
                      report.acceptedAt
                    )}
                  </p>
                )}

                {report.volunteerAssignedAt && (
                  <p>
                    🚑 Volunteer Assigned:
                    {" "}
                    {getTimeAgo(
                      report.volunteerAssignedAt
                    )}
                  </p>
                )}

                {report.rescuedAt && (
                  <p>
                    🐾 Rescued:
                    {" "}
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

                </div>

         <div className="ngo-action-buttons">

          {(report.status === "Pending" ||
            !report.status) && (
            <button
              className="accept-button"
              onClick={() =>
                updateRescueStatus(
                  report._id,
                  "Accepted"
                )
              }
            >
              Accept Rescue
            </button>
          )}

          {report.status === "Accepted" && (
            <button
              className="assign-button"
              onClick={() =>
                updateRescueStatus(
                  report._id,
                  "Volunteer Assigned"
                )
              }
            >
              Assign Volunteer
            </button>
          )}

          {report.status ===
            "Volunteer Assigned" && (
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
          )}

          {report.status === "Rescued" && (
            <div className="completed-rescue">
              ✅ Rescue Completed
            </div>
          )}

        </div>      
        </div>
             ))}

            </div>

      </div>

    </section>
  );
}

export default NGODashboard;
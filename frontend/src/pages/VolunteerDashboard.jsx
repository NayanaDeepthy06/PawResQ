import socket from "../socket";
import "./VolunteerDashboard.css";
import { useEffect, useState } from "react";
import { ENDPOINTS } from "../config";

function VolunteerDashboard() {

  const [cases, setCases] =
    useState([]);

 const volunteer =
  JSON.parse(
    localStorage.getItem(
      "volunteer"
    ) || "{}"
  );

  useEffect(() => {

    fetchCases();

  }, []);

  useEffect(() => {

  socket.on(
    "NEW_ESCALATED_CASE",
    (newCase) => {

      setCases(
        (previousCases) => {

          const alreadyExists =
            previousCases.some(
              (report) =>
                report._id ===
                newCase._id
            );

          if (
            alreadyExists
          ) {
            return previousCases;
          }

          return [
            newCase,
            ...previousCases,
          ];

        }
      );

    }
  );

  return () => {

    socket.off(
      "NEW_ESCALATED_CASE"
    );

  };

}, []);

  async function fetchCases() {

    const response =
      await fetch(
        ENDPOINTS.VOLUNTEER_ESCALATED_CASES
      );

    const data =
      await response.json();

    setCases(
      data.reports || []
    );

  }

  async function acceptCase(
    reportId
  ) {

    await fetch(

      ENDPOINTS.VOLUNTEER_ACCEPT_CASE(reportId),

      {
        method: "PATCH",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          volunteerId:
            volunteer._id,

          volunteerName:
            volunteer.name,

          volunteerPhone:
            volunteer.phoneNumber,

        })

      }

    );

    fetchCases();

  }
  async function markRescued(
  reportId
) {

  try {

    await fetch(

      ENDPOINTS.VOLUNTEER_MARK_RESCUED(reportId),

      {
        method: "PATCH",
      }

    );

    fetchCases();

  } catch (error) {

    console.error(error);

  }

}

  
  return (

<div className="volunteer-dashboard">

  <div className="dashboard-header">

    <h1>
      Volunteer Dashboard
    </h1>

    <p>
      Welcome,
      {" "}
      {volunteer?.name}
    </p>

  </div>

  {
    cases.length === 0 ? (

      <div className="empty-state">

        <h2>
          No Rescue Cases
        </h2>

        <p>
          New emergency cases
          will appear here.
        </p>

      </div>

    ) : (

      <div className="cases-grid">

        {
          cases.map(
            (report) => (

              <div
                key={report._id}
                className="case-card"
              >

                <div
                  className={`priority-badge ${
                    report.priorityLevel ===
                    "Emergency"
                      ? "priority-emergency"
                      : report.priorityLevel ===
                        "Urgent"
                      ? "priority-urgent"
                      : "priority-important"
                  }`}
                >

                  {
                    report.priorityLevel
                  }

                </div>

                {
                  report.imageUrl && (
                    <img
                      src={report.imageUrl}
                      alt="Injured Animal"
                      className="animal-image"
                    />
                  )
                }

                <h3>
                  {report.trackingId}
                </h3>

                <p>
                  <strong>
                    Animal:
                  </strong>
                  {" "}
                  {report.animalType}
                </p>

                <p>
                  <strong>
                    Location:
                  </strong>
                  {" "}
                  {report.location}
                </p>

                <p>
                  <strong>
                    Description:
                  </strong>
                  {" "}
                  {report.injuryDescription}
                </p>

                {
                  report.status ===
                  "Volunteer Assigned" ? (

                    <button
                      className="rescued-btn"
                      onClick={() =>
                        markRescued(
                          report._id
                        )
                      }
                    >
                      Mark As Rescued
                    </button>

                  ) : (

                    <button
                      className="accept-btn"
                      onClick={() =>
                        acceptCase(
                          report._id
                        )
                      }
                    >
                      Accept Rescue
                    </button>

                  )
                }

              </div>

            )
          )
        }

      </div>

    )
  }

</div>

);

}

export default VolunteerDashboard;
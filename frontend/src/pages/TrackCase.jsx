import { useState } from "react";
import "./TrackCase.css";
import {
  FaSearch,
  FaHeartbeat,
  FaBuilding,
  FaUserShield,
  FaCheckCircle,
  FaHome,
  FaRedo,
  FaClock,
} from "react-icons/fa";

function TrackCase() {

  const [trackingId, setTrackingId] =
    useState("");

  const [report, setReport] =
    useState(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleTrack() {

    if (!trackingId.trim()) {
      setError(
        "Please enter a Tracking ID"
      );
      return;
    }

    try {

      setLoading(true);
      setError("");

      const response =
        await fetch(
          `http://localhost:5001/api/reports/track/${trackingId}`
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message
        );
      }

      setReport(data.report);
      console.log(
      JSON.stringify(
        data.report,
        null,
        2
      )
    );

    } catch (error) {

      setReport(null);

      setError(
        error.message ||
        "Unable to track case"
      );

    } finally {

      setLoading(false);

    }

  }
let progress = 25;

if (report?.acceptedByNGO?.ngoName)
  progress = 50;

if (report?.volunteerAssignedAt)
  progress = 75;

if (report?.rescuedAt)
  progress = 100;

  return (
    <div className="track-page">

      <h1>
        Track Rescue Case
      </h1>

      <p>
        Enter your Tracking ID to view
        the latest rescue status.
      </p>

      <div className="track-box">

        <input
          type="text"
          placeholder="PRQ-XXXXXX"
          value={trackingId}
          onChange={(e) =>
            setTrackingId(
              e.target.value
            )
          }
        />

        <button
          onClick={handleTrack}
        >
          Track Case
        </button>

      </div>

      {loading && (
        <p>
          Searching...
        </p>
      )}

      {error && (
        <p>
          {error}
        </p>
      )}

      {report && (

        <div className="tracking-result">

          <h2>
            Case Details
          </h2>
                    {report.imageUrl && (
            <div className="animal-image-card">

                <img
                src={report.imageUrl}
                alt={report.animalType}
                className="tracked-animal-image"
                />

            </div>
            )}

         <div className="tracking-id-card">
                <h3>
                    Tracking ID
                </h3>

                <div className="tracking-id-value">
                    {report.trackingId}
                </div>

                </div>

        <div className="tracking-info-card">
            <h3>
                Animal
            </h3>
            <p>
                {report.animalType}
            </p>

            </div>

         <div className="tracking-status-card">
         <h3>
            <FaClock />
            Current Status
          </h3>

            <span
                className={`tracking-status-badge status-${report.status}`}
            >
                {report.status}
            </span>
        </div>

       <div className="tracking-info-grid">

  <div className="tracking-info-card">

                <h3>
                Severity
                </h3>
        <span
          className={`severity-badge severity-${report.severity}`}
        >
          {report.severity}
        </span>

            </div>

           <div className="tracking-info-card">
                <h3>
                  Priority
                </h3>

                <span
                  className={`priority-badge priority-${report.priorityLevel}`}
                >
                  {report.priorityLevel}
                </span>

              </div>
              <div className="tracking-info-card">
              <h3>Injury Description</h3>
              <p>{report.injuryDescription}</p>
            </div>

            <div className="tracking-info-card">
              <h3>Location</h3>
              <p>{report.location}</p>
            </div>

            <div className="tracking-info-card">
              <h3>Reported On</h3>
              <p>
                {new Date(report.createdAt).toLocaleString()}
              </p>
            </div>

            </div>
          
          <div className="tracking-section">

                <h3>
                  <FaBuilding />
                  Assigned NGO
                </h3>

                {
                  report.acceptedByNGO?.ngoName ? (

                    <div className="status-card success-card">

                      <h4>
                        NGO Accepted
                      </h4>

                      <p>
                        {report.acceptedByNGO.ngoName}
                      </p>

                      <small>
                        Accepted At:
                        {" "}
                        {new Date(
                          report.acceptedAt
                        ).toLocaleString()}
                      </small>

                    </div>

                  ) : (

                    <div className="status-card waiting-card">

                      <h4>
                        Waiting For NGO Acceptance
                      </h4>

                      <p>
                        Nearby NGOs have been notified.
                      </p>

                    </div>

                  )
                }

              </div>

        <div className="tracking-section">

  <h3>
    <FaUserShield />
    Volunteer Status
  </h3>

  {
    report.volunteerAssignedAt ? (

      <div className="status-card success-card">

        <h4>
          Volunteer Assigned
        </h4>
     <p>
      <strong>Volunteer Name:</strong>{" "}
      {report.assignedVolunteer?.volunteerName}
    </p>

    <p>
      <strong>Volunteer Contact:</strong>{" "}
      {report.assignedVolunteer?.volunteerPhone}
    </p>

      <small>
        Assigned At:
        {" "}
        {new Date(
          report.volunteerAssignedAt
        ).toLocaleString()}
      </small>

      </div>

    ) : (

      <div className="status-card waiting-card">

        <h4>
          Awaiting Volunteer Assignment
        </h4>

        <p>
          No volunteer assigned yet.
        </p>

      </div>

    )
  }

</div>

  <div className="tracking-section">

  <h3>

    <FaHeartbeat />

    Rescue Status

  </h3>

  {
    report.rescuedAt ? (

      <div className="status-card success-card">

        <h4>
          Animal Rescued Successfully
        </h4>

        <p>
          Rescue operation completed.
        </p>

        <small>
          {new Date(
            report.rescuedAt
          ).toLocaleString()}
        </small>

      </div>

    ) : (

      <div className="status-card waiting-card">

        <h4>
          Rescue In Progress
        </h4>

        <p>
          Animal has not yet been rescued.
        </p>

      </div>

    )
  }

</div>
      
      <div className="progress-card">


  <div className="progress-header">

    <h3>
      Rescue Progress
    </h3>

    <span>
      {progress}%
    </span>

  </div>

  <div className="progress-bar">

    <div
      className="progress-fill"
      style={{
        width: `${progress}%`,
      }}
    />

  </div>

</div>


               <div className="tracking-timeline">

                      <h3>
                         Rescue Timeline
                      </h3>

                      <div className="timeline-step complete">

                        <FaCheckCircle
                          className="timeline-icon"
                        />

                        <span>
                          Case Reported
                        </span>

                      </div>

                      <div
                        className={`timeline-step ${
                          report.acceptedByNGO?.ngoName
                            ? "complete"
                            : "pending"
                        }`}
                      >

                        <FaBuilding
                          className="timeline-icon"
                        />

                        <span>
                          NGO Accepted
                        </span>

                      </div>

                      <div
                        className={`timeline-step ${
                          report.volunteerAssignedAt
                            ? "complete"
                            : "pending"
                        }`}
                      >

                        <FaUserShield
                          className="timeline-icon"
                        />

                        <span>
                          Volunteer Assigned
                        </span>

                      </div>

                      <div
                        className={`timeline-step ${
                          report.rescuedAt
                            ? "complete"
                            : "pending"
                        }`}
                      >

                        <FaHeartbeat
                          className="timeline-icon"
                        />

                        <span>
                          Animal Rescued
                        </span>

                      </div>

                    </div>

                        <div className="tracking-actions">

                <button
                  className="home-btn"
                  onClick={() =>
                    window.location.href = "/"
                  }
                >

                  <FaHome />

                  Home

                </button>

                <button
                  className="track-again-btn"
                  onClick={() => {

                    setReport(null);

                    setTrackingId("");

                  }}
                >

                  <FaRedo />

                  Track Another Case

                </button>

              </div>

        </div>

      )}

    </div>
  );
}

export default TrackCase;
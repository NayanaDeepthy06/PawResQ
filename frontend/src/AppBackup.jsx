import { useEffect, useRef, useState } from "react";
import "./App.css";
import RescueMap from "./components/RescueMap";
import NGODashboard from "./components/NGODashboard";

const features = [
  {
    title: "Report Injury",
    description:
      "Citizens can upload an animal photo, describe the injury, and share the location.",
  },
  {
    title: "AI Severity Triage",
    description:
      "The system estimates injury urgency as Low, Medium, High, or Critical.",
  },
  {
    title: "Nearby NGO Alert",
    description:
      "Reports are matched with nearby NGOs based on distance and case priority.",
  },
  {
    title: "Volunteer Escalation",
    description:
      "Critical cases can be escalated to verified nearby volunteers if NGOs do not respond.",
  },
];

const initialReport = {
  animalType: "",
  injuryDescription: "",
  location: "",
  landmark: "",
  contactNumber: "",
  image: null,
  latitude: null,
  longitude: null,
  
};

function App() {
  const [report, setReport] = useState(initialReport);
  const [imagePreview, setImagePreview] = useState(null);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [locationMode, setLocationMode] = useState("");
  const [locationConfirmed, setLocationConfirmed] =  useState(false);
  const fileInputRef = useRef(null);
  const mapSectionRef = useRef(null);
  const locationInputRef = useRef(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [detectedAddress, setDetectedAddress] = useState("");
useEffect(() => {
  if (selectedPosition) {
    setReport((currentReport) => ({
      ...currentReport,
      latitude: selectedPosition[0],
      longitude: selectedPosition[1],
      location: detectedAddress,
    }));

    setLocationConfirmed(false);
  }
}, [selectedPosition, detectedAddress]);

  function handleChange(event) {
  const { name, value } = event.target;
  if (name === "contactNumber") {
  const numericValue =
    value.replace(/\D/g, "");

  setReport((currentReport) => ({
    ...currentReport,
    contactNumber: numericValue,
  }));

  return;
}

  setReport((currentReport) => ({
    ...currentReport,
    [name]: value,
  }));
}
function handleImageChange(event) {
  const selectedFile = event.target.files[0];

  if (!selectedFile) {
  return;
}
  if (!selectedFile.type.startsWith("image/")) {
  setFormError("Only image files are allowed.");
  setImagePreview(null);

      setReport((currentReport) => ({
        ...currentReport,
        image: null,
      }));
  return;
}

if (selectedFile.size > 5 * 1024 * 1024) {
  setFormError("Image size must be below 5MB.");
  setImagePreview(null);

    setReport((currentReport) => ({
      ...currentReport,
      image: null,
    }));
  return;
}

setFormError("");

  if (selectedFile) {
    setReport((currentReport) => ({
      ...currentReport,
      image: selectedFile,
    }));

    setImagePreview(URL.createObjectURL(selectedFile));
  }
}

function handleRemoveImage() {
  setReport((currentReport) => ({
    ...currentReport,
    image: null,
  }));

  setImagePreview(null);
}

function handleUseCurrentLocation() {
  setLocationMode("current");

  mapSectionRef.current?.scrollIntoView({
    behavior: "smooth",
  });

  alert(
    "Detecting your current rescue location. Please verify it on the map."
  );

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const newPosition = [
        position.coords.latitude,
        position.coords.longitude,
      ];

      setSelectedPosition(newPosition);
      setLocationConfirmed(false);
    },

    (error) => {
      console.error(error);

      alert(
        "Unable to detect current location."
      );
    }
  );
}

function handlePinLocation() {
  setLocationMode("pin");
  setLocationConfirmed(false);

  mapSectionRef.current?.scrollIntoView({
    behavior: "smooth",
  });

  alert(
    "Please tap on the map to select the exact rescue location."
  );
}

function handleManualLocation() {
  setLocationMode("manual");
  setLocationConfirmed(false);

  locationInputRef.current?.scrollIntoView({
    behavior: "smooth",
  });

  locationInputRef.current?.focus();

  alert(
    "Please enter the rescue location manually."
  );
}

async function handleSubmit(event) {
  event.preventDefault();
  if (!locationConfirmed) {
  setFormError(
    "Please confirm the rescue location before submitting."
  );

  return;
}
if (
  !report.animalType ||
  !report.injuryDescription ||
  !report.location ||
  !report.contactNumber
) {
  setFormError("Please fill all required fields.");
  return;
}

if (report.contactNumber.length < 10) {
  setFormError("Please enter a valid contact number.");
  return;
}

if (report.injuryDescription.trim().length < 15) {
  setFormError(
    "Please provide a more detailed injury description."
  );
  return;
}

   setFormError("");
  setIsSubmitting(true);

const formData = new FormData();
formData.append("animalType",report.animalType);
formData.append("injuryDescription",report.injuryDescription);
formData.append("location",report.location);
formData.append("contactNumber",report.contactNumber);
formData.append("landmark", report.landmark);
if (
  report.latitude !== null &&
  report.longitude !== null
) {
  formData.append(
    "latitude",
    report.latitude
  );

  formData.append(
    "longitude",
    report.longitude
  );
}

if(report.image){
  formData.append("image",report.image);
}

  try {
      const controller = new AbortController();

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 10000);
    const response = await fetch(
      "http://localhost:5001/api/reports",
      {
        method: "POST",
       
        body: formData,
        signal: controller.signal,
      }
    );

  const data = await response.json();
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(data.message || "Submission failed");
    }

    setSubmittedReport(data.report);
    setSubmissionSuccess(true);
    setFormError("");
    setReport(initialReport);
    setSelectedPosition(null);
    setDetectedAddress("");
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
} catch (error) {
  setFormError(
    "Unable to submit rescue report. Please try again."
  );
} finally {
  setIsSubmitting(false);
}
}

function getSeverityClass(severity) {
  switch (severity) {
    case "Critical":
      return "severity-critical";

    case "High":
      return "severity-high";

    case "Medium":
      return "severity-medium";

    default:
      return "severity-low";
  }
}

function getPriorityClass(priorityLevel) {
  switch (priorityLevel) {
    case "Emergency":
      return "priority-emergency";

    case "Urgent":
      return "priority-urgent";

    case "Important":
      return "priority-important";

    default:
      return "priority-routine";
  }
}

function getStatusClass(status) {
  switch (status) {
    case "Accepted":
      return "status-accepted";

    case "Rescued":
      return "status-rescued";

    case "Closed":
      return "status-closed";

    default:
      return "status-pending";
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

  return (
    <main className="app-container">
      <section className="hero-section">
        <p className="project-label">AI-Powered Animal Welfare Platform</p>

        <h1>PawResQ</h1>

        <p className="hero-description">
          PawResQ helps citizens report injured street animals, connect cases
          with nearby NGOs, and support faster rescue coordination.
        </p>

        <button className="primary-button">Report Injured Animal</button>
        <form className="report-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h2>Report Injured Animal</h2>
              <p>
                Share the basic details so PawResQ can prepare this case for rescue
                coordination.
              </p>
            </div>

            <div className="form-grid">
              <label>
                Animal Type
                <select
                  name="animalType"
                  value={report.animalType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select animal</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Cattle">Cattle</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label>
                Contact Number
               <input
                type="tel"
                name="contactNumber"
                value={report.contactNumber}
                onChange={handleChange}
                placeholder="Reporter contact number"
                required
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="10"
              />
              </label>
            </div>

            <label>
              Injury Description
              <textarea
                name="injuryDescription"
                value={report.injuryDescription}
                onChange={handleChange}
                placeholder="Example: Dog hit by bike and bleeding near leg"
                rows="5"
                required
              />
            </label>

        <div className="input-group">
          <div className="location-selection-container">
            <h3>Select Rescue Location Method</h3>

            <p className="location-helper-text">
              Choose how you want to provide the rescue location.
            </p>

            <div className="location-options-grid">

              <button
                type="button"
                className={`location-option-card ${
                  locationMode === "current"
                    ? "active-location-card"
                    : ""
                }`}
                onClick={handleUseCurrentLocation}
              >
                📍
                <span>Use Current Location</span>
              </button>

              <button
                type="button"
                className={`location-option-card ${
                  locationMode === "pin"
                    ? "active-location-card"
                    : ""
                }`}
                onClick={handlePinLocation}
              >
                📌
                <span>Pin Exact Rescue Spot</span>
              </button>

              <button
                type="button"
                className={`location-option-card ${
                  locationMode === "manual"
                    ? "active-location-card"
                    : ""
                }`}
                onClick={handleManualLocation}
              >
                ✍
                <span>Type Location Manually</span>
              </button>

            </div>
          </div>
          <label htmlFor="location">
            Location
          </label>

          <input
            type="text"
            id="location"
            name="location"
            value={report.location}
            onChange={handleChange}
            placeholder="Area, landmark, or street name"
            required
            ref={locationInputRef}
          />
         {report.location && (
              <div className="location-confirmation-box">

                <p>
                  📍 Please verify that this is the exact
                  rescue location.
                </p>

                <button
                  type="button"
                  className={`confirm-location-button ${
                    locationConfirmed
                      ? "location-confirmed"
                      : ""
                  }`}
                  onClick={() =>
                    setLocationConfirmed(true)
                  }
                >
                  {locationConfirmed
                    ? "✅ Location Confirmed"
                    : "Confirm Rescue Location"}
                </button>

              </div>
            )} 
        </div>

        <div className="input-group">
          <label htmlFor="landmark">
            Nearby Landmark
          </label>

          <input
            type="text"
            id="landmark"
            name="landmark"
            placeholder="Ex: Near Singareni Park gate"
            value={report.landmark}
            onChange={handleChange}
          />
        </div>

          <label className="image-upload-field">
              Animal Image

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />

              {imagePreview && (
                <div className="image-preview-container">
                  <img
                    src={imagePreview}
                    alt="Animal Preview"
                    className="animal-preview-image"
                  />
                  <button
                        type="button"
                        className="remove-image-button"
                        onClick={handleRemoveImage}
                      >
                        Remove Image
                      </button>
                </div>
              )}
            </label>
            {formError && (
              <div className="form-error">
                {formError}
              </div>
            )}

            <button
              className="submit-button"
              type="submit"
              disabled={
              isSubmitting || !locationConfirmed
            }
            >
              {isSubmitting
                ? "Processing Rescue Report..."
                : "Submit Rescue Report"}
            </button>
         
          </form>

  {submittedReport && (
  <>
    {submissionSuccess && (
      <div className="success-banner">
        <h3>✅ Rescue Report Submitted Successfully</h3>

        <p>
          PawResQ has registered this case and prepared it for
          rescue coordination workflow.
        </p>
      </div>
    )}

    <section className="report-preview">
    <div className="form-header">
      <h2>Submitted Report Preview</h2>
      <p>
        PawResQ has analyzed this rescue report and generated an AI-assisted
        severity and priority assessment for rescue coordination.
      </p>
    </div>
      {submittedReport.priorityLevel === "Emergency" && (
        <div className="emergency-alert">
          <h3>🚨 Emergency Rescue Required</h3>

          <p>
            This case has been classified as high priority and may require
            immediate NGO or volunteer intervention.
          </p>
        </div>
      )}
            <div className="details-group">
          <h3 className="group-title">Animal Information</h3>

          <div className="detail-item">
              <span className="detail-key">Animal</span>
              <span>{submittedReport.animalType}</span>
          </div>

          <div className="detail-item">
              <span className="detail-key">Description</span>
              <span>{submittedReport.injuryDescription}</span>
          </div>

          <div className="detail-item">
              <span className="detail-key">Location</span>
              <span>{submittedReport.location}</span>
          </div>

          <div className="detail-item">
              <span className="detail-key">Contact</span>
              <span>{submittedReport.contactNumber}</span>
          </div>

          <div className="detail-item">
              <span className="detail-key">Status</span>

              <span
                className={`status-badge ${getStatusClass(
                  submittedReport.status
                )}`}
              >
                {submittedReport.status}
              </span>
            </div>
        </div>
     <div className="assessment-card">
  <h3 className="group-title">AI Rescue Assessment</h3>

  <div className="assessment-content">

    <div className="severity-section">
      <span className="detail-label">Predicted Severity</span>

      <span
        className={`severity-badge ${getSeverityClass(
          submittedReport.severity
        )}`}
      >
        {submittedReport.severity}
      </span>

      <p className="priority-score">
        Severity Score: {submittedReport.severityScore}
      </p>
    </div>

    <div className="priority-section">
      <span className="detail-label">Priority Level</span>

      <span
        className={`priority-badge ${getPriorityClass(
          submittedReport.priorityLevel
        )}`}
      >
        {submittedReport.priorityLevel}
      </span>

      <p className="priority-score">
        Priority Score: {submittedReport.priorityScore}
      </p>
    </div>

    <div>
      <p>
        <strong>Prediction Reasons:</strong>{" "}
        {submittedReport.severityReasons?.join(", ")}
      </p>
    </div>

      </div>
   </div>
    
    <div className="metadata-card">
        <h3 className="group-title">Case Metadata</h3>

        <div className="detail-item">
          <span className="detail-key">Report ID</span>
          <span>{submittedReport._id}</span>
        </div>

        <div className="detail-item">
          <span className="detail-key">Created At</span>
         <span>{formatDate(submittedReport.createdAt)}</span>
        </div>

       <div className="metadata-image-section">
          <span className="detail-key">Uploaded Animal Image</span>

          {submittedReport.imageUrl ? (
            <img
              src={submittedReport.imageUrl}
              alt="Uploaded animal"
              className="metadata-image"
            />
            ) : (
              <p>No image uploaded</p>
            )}
        </div>
   </div>
    
   
</section>

  </>
)}

  <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <h2>{feature.title}</h2>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
            <p className="map-instruction">
              📌 Click anywhere on the map to
              pin the exact rescue location.
            </p>
          <div ref={mapSectionRef}>
            <RescueMap
            selectedPosition={selectedPosition}
            setSelectedPosition={setSelectedPosition}
            setDetectedAddress={setDetectedAddress}
            submittedReport={submittedReport}
          />
          </div>
       <NGODashboard />
      </section>
    </main>
  );
}

export default App;

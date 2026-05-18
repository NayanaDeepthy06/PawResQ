import { useState } from "react";
import "./App.css";


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
  contactNumber: "",
  image: null,
};


function App() {
  const [report, setReport] = useState(initialReport);
  const [imagePreview, setImagePreview] = useState(null);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  function handleChange(event) {
  const { name, value } = event.target;

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

async function handleSubmit(event) {
  event.preventDefault();
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

            <label>
              Location
              <input
                type="text"
                name="location"
                value={report.location}
                onChange={handleChange}
                placeholder="Area, landmark, or street name"
                required
              />
            </label>

          <label className="image-upload-field">
              Animal Image

              <input
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
              disabled={isSubmitting}
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
      </section>
    </main>
  );
}

export default App;


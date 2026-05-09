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
  const [submittedReport, setSubmittedReport] = useState(null);

  function handleChange(event) {
  const { name, value } = event.target;

  setReport((currentReport) => ({
    ...currentReport,
    [name]: value,
  }));
}

function handleImageChange(event) {
  const selectedFile = event.target.files[0];

  setReport((currentReport) => ({
    ...currentReport,
    image: selectedFile,
  }));
}

async function handleSubmit(event) {
  event.preventDefault();

  const reportPayload = {
    animalType: report.animalType,
    injuryDescription: report.injuryDescription,
    location: report.location,
    contactNumber: report.contactNumber,
  };

  const response = await fetch("http://localhost:5001/api/reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reportPayload),
  });

  const data = await response.json();

  setSubmittedReport(data.report);
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

            <label>
              Animal Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </label>

            <button className="submit-button" type="submit">
              Submit Rescue Report
            </button>
          </form>

  {submittedReport && (
  <section className="report-preview">
    <div className="form-header">
      <h2>Submitted Report Preview</h2>
      <p>This preview shows the form data currently stored in React state.</p>
    </div>

    <div className="preview-details">
      <p>
        <strong>Animal:</strong> {submittedReport.animalType}
      </p>
      <p>
        <strong>Description:</strong> {submittedReport.injuryDescription}
      </p>
      <p>
        <strong>Location:</strong> {submittedReport.location}
      </p>
      <p>
        <strong>Contact:</strong> {submittedReport.contactNumber}
      </p>
      <p>
        <strong>Status:</strong> {submittedReport.status}
      </p>
      <p>
        <strong>Report ID:</strong> {submittedReport.id}
      </p>
      <p>
        <strong>Created At:</strong> {submittedReport.createdAt}
      </p>

      <p>
        <strong>Image:</strong>{" "}
        {submittedReport.image ? submittedReport.image.name : "No image selected"}
      </p>
    </div>
  </section>
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


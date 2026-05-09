import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const reports = [];

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    message: "PawResQ backend running",
    status: "ok",
  });
});

app.post("/api/reports", (req, res) => {
  const reportData = req.body;

  const newReport = {
    id: Date.now().toString(),
    animalType: reportData.animalType,
    injuryDescription: reportData.injuryDescription,
    location: reportData.location,
    contactNumber: reportData.contactNumber,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  reports.push(newReport);

  res.status(201).json({
    message: "Report submitted successfully",
    report: newReport,
  });
});

app.get("/api/reports", (req, res) => {
  res.json({
    count: reports.length,
    reports,
  });
});


app.listen(PORT, () => {
  console.log(`PawResQ backend running on http://localhost:${PORT}`);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Report from "./models/Report.js";

dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

connectDB();


const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    message: "PawResQ backend running",
    status: "ok",
  });
});

app.post("/api/reports", async (req, res) => {
  try {
    const report = await Report.create({
      animalType: req.body.animalType,
      injuryDescription: req.body.injuryDescription,
      location: req.body.location,
      contactNumber: req.body.contactNumber,
    });

    res.status(201).json({
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to submit report",
      error: error.message,
    });
  }
});


app.get("/api/reports", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });

    res.json({
      count: reports.length,
      reports,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
});


app.listen(PORT, () => {
  console.log(`PawResQ backend running on http://localhost:${PORT}`);
});

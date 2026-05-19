import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Report from "./models/Report.js";
import upload from "./middleware/upload.js"

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
function predictSeverity(description) {
  const text = description.toLowerCase();

  const rules = [
    {
      severity: "Critical",
      score: 90,
      keywords: [
        "unconscious",
        "not moving",
        "hit by car",
        "hit by bike",
        "accident",
        "heavy bleeding",
        "fracture",
        "broken leg",
        "dying",
      ],
    },
    {
      severity: "High",
      score: 70,
      keywords: [
        "bleeding",
        "deep wound",
        "infected",
        "maggots",
        "unable to walk",
        "burn",
        "severe pain",
      ],
    },
    {
      severity: "Medium",
      score: 45,
      keywords: [
        "limping",
        "small wound",
        "weak",
        "swelling",
        "skin problem",
        "injured",
      ],
    },
    {
      severity: "Low",
      score: 20,
      keywords: [
        "hungry",
        "abandoned",
        "minor injury",
        "lost",
        "needs food",
      ],
    },
  ];

  for (const rule of rules) {
    const matchedKeywords = rule.keywords.filter((keyword) =>
      text.includes(keyword)
    );

    if (matchedKeywords.length > 0) {
      return {
        severity: rule.severity,
        severityScore: rule.score,
        severityReasons: matchedKeywords,
      };
    }
  }

  return {
    severity: "Low",
    severityScore: 20,
    severityReasons: ["No high-risk injury keywords found"],
  };
}

function calculatePriority(severityScore) {
  if (severityScore >= 85) {
    return {
      priorityScore: 95,
      priorityLevel: "Emergency",
    };
  }

  if (severityScore >= 65) {
    return {
      priorityScore: 75,
      priorityLevel: "Urgent",
    };
  }

  if (severityScore >= 40) {
    return {
      priorityScore: 50,
      priorityLevel: "Important",
    };
  }

  return {
    priorityScore: 25,
    priorityLevel: "Routine",
  };
}




const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors());

app.use(express.json({
  limit: "10mb",
}));

app.get("/api/health", (req, res) => {
  res.json({
    message: "PawResQ backend running",
    status: "ok",
  });
});

app.post(
  "/api/reports",
  upload.single("image"),
  async (req, res) => {
  try {
 const {
  animalType,
  injuryDescription,
  location,
  contactNumber,
} = req.body;

if (
  !animalType ||
  !injuryDescription ||
  !location ||
  !contactNumber
) {
  return res.status(400).json({
    message: "All required fields must be provided.",
  });
}

if (contactNumber.trim().length < 10) {
  return res.status(400).json({
    message: "Invalid contact number.",
  });
}

if (injuryDescription.trim().length < 15) {
  return res.status(400).json({
    message:
      "Please provide a more detailed injury description.",
  });
} 
const severityPrediction = predictSeverity(req.body.injuryDescription);
const priority = calculatePriority(severityPrediction.severityScore);
const report = await Report.create({
  animalType,
  injuryDescription,
  location,
  contactNumber,
  imageUrl: req.file?.path || "",
  severity: severityPrediction.severity,
  severityScore: severityPrediction.severityScore,
  severityReasons: severityPrediction.severityReasons,
  priorityScore : priority.priorityScore,
  priorityLevel:priority.priorityLevel,
});


    res.status(201).json({
      message: "Report submitted successfully",
      report,
    });
 } catch (error) {

  console.error("REPORT SUBMISSION ERROR:");
  console.error(error);

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

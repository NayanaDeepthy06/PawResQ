import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Report from "./models/Report.js";
import upload from "./middleware/upload.js";
import bcrypt from "bcryptjs";
import NGO from "./models/NGO.js";
import jwt from "jsonwebtoken";

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
  landmark,
  contactNumber,
  latitude,
  longitude,
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
const severityPrediction = predictSeverity(injuryDescription);
const priority = calculatePriority(severityPrediction.severityScore);
const report = await Report.create({
  animalType,
  injuryDescription,
  location,
  landmark,
  contactNumber,
  latitude,
  longitude,
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

app.patch(
  "/api/reports/:id/status",
  async (req, res) => {
    try {

      const { id } = req.params;

      const { status } = req.body;

      const updatedFields = {
        status,
      };

      if (status === "Accepted") {
        updatedFields.acceptedAt =
          new Date();
      }

      if (
        status ===
        "Volunteer Assigned"
      ) {
        updatedFields.volunteerAssignedAt =
          new Date();
      }

      if (status === "Rescued") {
        updatedFields.rescuedAt =
          new Date();
      }

      const updatedReport =
        await Report.findByIdAndUpdate(
          id,
          updatedFields,
          { new: true }
        );

      res.status(200).json({
        success: true,
        report: updatedReport,
      });

    } catch (error) {

      console.error(
        "Failed to update rescue status:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update rescue status",
      });
    }
  }
);

app.post(
  "/api/ngo/register",
  async (req, res) => {
    try {
      const {
        ngoName,
        email,
        password,
        phoneNumber,
        city,
      } = req.body;

      const existingNGO =
        await NGO.findOne({ email });

      if (existingNGO) {
        return res.status(400).json({
          success: false,
          message:
            "NGO already exists",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const ngo =
        await NGO.create({
          ngoName,
          email,
          password:
            hashedPassword,
          phoneNumber,
          city,
        });

      res.status(201).json({
        success: true,
        ngo,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Registration failed",
      });
    }
  }
);

app.post(
  "/api/ngo/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      const ngo =
        await NGO.findOne({
          email,
        });

      if (!ngo) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid email",
        });
      }

      const isMatch =
        await bcrypt.compare(
          password,
          ngo.password
        );

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid password",
        });
      }
      if (!ngo.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "NGO verification pending. Please wait for admin approval.",
      });
    }
      const token =
        jwt.sign(
          {
            ngoId: ngo._id,
            ngoName:
              ngo.ngoName,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

      res.json({
        success: true,
        token,
        ngo: {
          id: ngo._id,
          ngoName:
            ngo.ngoName,
          email:
            ngo.email,
          city:
            ngo.city,
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Login failed",
      });
    }
  }
);

   app.patch(
 "/api/admin/ngo/:id/approve",
 async (req, res) => {
   try {


     const ngo =
       await NGO.findByIdAndUpdate(
         req.params.id,
         {
           isVerified: true,
           verificationStatus:
             "Approved",
         },
         { new: true }
       );


     if (!ngo) {
       return res.status(404).json({
         success: false,
         message:
           "NGO not found",
       });
     }


     res.json({
       success: true,
       message:
         "NGO approved successfully",
       ngo,
     });


   } catch (error) {


     console.error(error);


     res.status(500).json({
       success: false,
       message:
         "Approval failed",
     });
   }
 }
);

app.get(
 "/api/admin/pending-ngos",
 async (req, res) => {
   try {


     const ngos =
       await NGO.find({
         isVerified: false,
       });


     res.json({
       success: true,
       ngos,
     });


   } catch (error) {


     console.error(error);


     res.status(500).json({
       success: false,
       message:
         "Failed to fetch NGOs",
     });
   }
 }
);

app.listen(PORT, () => {
  console.log(`PawResQ backend running on http://localhost:${PORT}`);
});

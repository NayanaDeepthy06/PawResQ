
import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import axios from "axios";
import FormData from "form-data";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Report from "./models/Report.js";
import upload from "./middleware/upload.js";
import verifyNGO from "./middleware/verifyNGO.js";
import generateTrackingId from "./utils/generateTrackingId.js";
import bcrypt from "bcryptjs";
import NGO from "./models/NGO.js";
import Adoption from "./models/Adoption.js";
import Volunteer from "./models/Volunteer.js";
import calculateDistance from "./utils/calculateDistance.js";
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


// app.use(cors());
const allowedOrigins = [
  "https://pawresq.vercel.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

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

let aiResult = {

  animal: "",
  animal_confidence: 0,

  injury: "",
  injury_confidence: 0,

  severity: "",

  ngo_alert_required: false,

};

try {

  if (req.file?.path) {

    const formData =
      new FormData();

    const imageResponse =
      await axios.get(
        req.file.path,
        {
          responseType:
            "arraybuffer",
        }
      );

    formData.append(
      "image",
      Buffer.from(
        imageResponse.data
      ),
      "animal.jpg"
    );

    formData.append(
      "description",
      injuryDescription
    );

    const aiResponse =
      await axios.post(

        "http://127.0.0.1:5000/predict",

        formData,

        {
          headers:
            formData.getHeaders(),
        }

      );

    aiResult =
      aiResponse.data;

    console.log(
      "AI RESULT:",
      aiResult
    );

  }

} catch (error) {

  console.error(
    "AI SERVICE ERROR:"
  );

  console.error(
    error.message
  );

}

const severityPrediction =
  aiResult.severity

    ? {

        severity:

          aiResult.severity === "CRITICAL"
            ? "Critical"

          : aiResult.severity === "HIGH"
            ? "High"

          : aiResult.severity === "MEDIUM"
            ? "Medium"

          : "Low",

        severityScore:

          aiResult.severity === "CRITICAL"
            ? 90

          : aiResult.severity === "HIGH"
            ? 70

          : aiResult.severity === "MEDIUM"
            ? 45

          : 20,

        severityReasons: [
          `AI detected ${aiResult.injury}`,
        ],

      }

    : predictSeverity(
        injuryDescription
      );
      

      const priority =
  calculatePriority(
    severityPrediction.severityScore
  );


const trackingId = generateTrackingId();
const report = await Report.create({
  trackingId,
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
  aiAnimal:
  aiResult.animal || "",

aiAnimalConfidence:
  aiResult.animal_confidence || 0,

aiInjury:
  aiResult.injury || "",

aiInjuryConfidence:
  aiResult.injury_confidence || 0,

aiSeverity:
  aiResult.severity || "",

ngoAlertRequired:
  aiResult.ngo_alert_required || false,
});
console.log(
  "REPORT LOCATION:",
  report.latitude,
  report.longitude
);

const approvedNGOs =
  await NGO.find({
    isVerified: true,
  });
  console.log(
  "APPROVED NGOs:",
  approvedNGOs.length
);

console.log(
  approvedNGOs.map(
    ngo => ({
      name: ngo.ngoName,
      verified: ngo.isVerified,
      lat: ngo.latitude,
      lng: ngo.longitude
    })
  )
);

const ALERT_RADIUS_KM = 15;

for (const ngo of approvedNGOs) {

  const distance =
    calculateDistance(
      report.latitude,
      report.longitude,
      ngo.latitude,
      ngo.longitude
    );

  console.log(
    "DISTANCE TO NGO:",
    ngo.ngoName,
    distance
  );
}

const nearbyNGOs =
  approvedNGOs.filter(
    (ngo) => {

      const distance =
        calculateDistance(
          report.latitude,
          report.longitude,
          ngo.latitude,
          ngo.longitude
        );

      return distance <= ALERT_RADIUS_KM;

    }
  );

console.log(
  "Nearby NGOs:",
  nearbyNGOs.map(
    (ngo) => ngo.ngoName
  )
);
for (const ngo of nearbyNGOs) {

  const distance =
    calculateDistance(
      report.latitude,
      report.longitude,
      ngo.latitude,
      ngo.longitude
    );

  console.log(
    "SENDING ALERT TO:",
    ngo.ngoName
  );

  console.log(
    "ROOM:",
    `ngo_${ngo._id}`
  );

  console.log(
    "DISTANCE:",
    distance
  );

  console.log(
  "EMITTING TO ROOM:",
  `ngo_${ngo._id}`
);

  io.to(
    `ngo_${ngo._id}`
  ).emit(
    "NEARBY_RESCUE_ALERT",
    {
      report,
      distance:
        distance.toFixed(1),
    }
  );

  console.log(
  "ALERT SENT"
);

}

io.emit(
  "NEW_RESCUE_CASE",
  report
);

    res.status(201).json({
  message:
    "Report submitted successfully",
  trackingId:
    report.trackingId,
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
  verifyNGO,
  async (req, res) => {
      console.log(
      "STATUS ROUTE HIT"
    );

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
   
      const report =
      await Report.findById(id);

    if (!report) {

      return res.status(404).json({
        success: false,
        message: "Report not found",
      });

    }
    if (
  report.acceptedByNGO?.ngoId?.toString() !==
  req.ngo.ngoId
  ) {

      return res.status(403).json({
        success: false,
        message:
          "You do not own this rescue case",
      });

    }
      const updatedReport =
        await Report.findByIdAndUpdate(
          id,
          updatedFields,
          {
          returnDocument: "after",
        }
        );
       
        if (
          status ===
          "Volunteer Assigned"
        ) {

          io.emit(
            "VOLUNTEER_ASSIGNED",
            updatedReport
          );

          io.to(
            `tracking_${updatedReport.trackingId}`
          ).emit(
            "CASE_UPDATED",
            updatedReport
          );

        }

        if (
          status ===
          "Rescued"
        ) {

          io.emit(
            "CASE_RESCUED",
            updatedReport
          );

          io.to(
            `tracking_${updatedReport.trackingId}`
          ).emit(
            "CASE_UPDATED",
            updatedReport
          );

        }

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

app.patch(
  "/api/reports/:id/accept",
  verifyNGO,
  async (req, res) => {

    try {

      const { id } =
        req.params;

     const ngoId = req.ngo.ngoId;
    const ngoName = req.ngo.ngoName;
  

      const report =
        await Report.findById(id);

      if (!report) {

        return res.status(404).json({
          success: false,
          message:
            "Report not found",
        });

      }

      if (
        report.acceptedByNGO?.ngoId
      ) {

        return res.status(400).json({
          success: false,
          message:
            `Already accepted by ${report.acceptedByNGO.ngoName}`,
        });

      }

      report.status =
        "Accepted";

      report.acceptedAt =
        new Date();

      report.acceptedByNGO = {
        ngoId,
        ngoName,
      };

      await report.save();

      io.emit(
      "CASE_ACCEPTED",
      report
    );

    io.to(
      `tracking_${report.trackingId}`
    ).emit(
      "CASE_UPDATED",
      report
    );

      res.json({
        success: true,
        report,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to accept rescue",
      });

    }

  }
);

app.patch(
  "/api/reports/:id/assign-volunteer",
  async (req, res) => {

    try {

      const {
        volunteerName,
        volunteerPhone,
      } = req.body;

      const report =
        await Report.findById(
          req.params.id
        );

      if (!report) {

        return res.status(404).json({
          success: false,
          message:
            "Case not found",
        });

      }

      report.assignedVolunteer = {

        volunteerName,

        volunteerPhone,

        volunteerType:
          "NGO",

      };

      report.volunteerAssignedAt =
        new Date();

      report.status =
        "Volunteer Assigned";

      await report.save();

              io.emit(
          "VOLUNTEER_ASSIGNED",
          report
        );

        io.to(
          `tracking_${report.trackingId}`
        ).emit(
          "CASE_UPDATED",
          report
        );

      res.json({
        success: true,
        message:
          "Volunteer assigned successfully",
        report,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Volunteer assignment failed",
      });

    }

  }
);



app.get(
  "/api/reports/track/:trackingId",
  async (req, res) => {
    try {

      const { trackingId } =
        req.params;

      const report =
        await Report.findOne({
          trackingId,
        });

      if (!report) {

        return res.status(404).json({
          success: false,
          message:
            "Tracking ID not found",
        });

      }

      res.json({
        success: true,
        report,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch report",
      });

    }
  }
);

app.get(
  "/api/reports/:trackingId/nearby-volunteers",
  async (req, res) => {

    try {

      const report =
        await Report.findOne({
          trackingId:
            req.params.trackingId,
        });

      if (!report) {

        return res.status(404).json({
          success: false,
          message:
            "Report not found",
        });

      }

      const volunteers =
        await Volunteer.find({
          verificationStatus:
            "Approved",
        }).select(
          "name phoneNumber latitude longitude"
        );

      const nearbyVolunteers =
        volunteers
          .map((volunteer) => {

            const distance =
              calculateDistance(

                report.latitude,
                report.longitude,

                volunteer.latitude,
                volunteer.longitude

              );

            return {

              name:
                volunteer.name,

              phoneNumber:
                volunteer.phoneNumber,

              distance:
                Number(
                  distance.toFixed(1)
                ),

            };

          })

          .filter(
            (volunteer) =>
              volunteer.distance <= 30
          )

          .sort(
            (a, b) =>
              a.distance - b.distance
          );

      res.json({

        success: true,

        volunteers:
          nearbyVolunteers,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch nearby volunteers",

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
        address,
        latitude,
        longitude,
      } = req.body;

      if (
        !latitude ||
        !longitude
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please select NGO location on map",
        });
      }

      const existingNGO =
        await NGO.findOne({ email });

      if (existingNGO) {
        return res.status(400).json({
          success: false,
          message:
             "NGO already registered. Please login.",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

  const ngo = new NGO({
  ngoName,
  email,
  password: hashedPassword,
  phoneNumber,
  address,
  latitude,
  longitude,
});

    await ngo.save();

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Waiting for admin approval.",
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
        ngoName: ngo.ngoName,
        email: ngo.email,
        address: ngo.address,
        latitude: ngo.latitude,
        longitude: ngo.longitude,
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
  "/api/ngo/location",
  verifyNGO,
  async (req, res) => {

    try {

      const {
        latitude,
        longitude,
      } = req.body;

      const ngo =
        await NGO.findByIdAndUpdate(
          req.ngo.ngoId,
          {
            latitude,
            longitude,
          },
          {
           returnDocument: "after",
          }
        );

      res.json({
        success: true,
        ngo,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to update location",
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
        {
        returnDocument: "after",
      }
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

app.get(
  "/api/admin/approved-ngos",
  async (req, res) => {

    try {

      const ngos =
        await NGO.find({
          isVerified: true
        });

      res.json({
        success: true,
        ngos
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch approved NGOs"
      });

    }

  }
);

app.post(
"/api/volunteer/register",
upload.single("proofImage"),
async (req, res) => {


try {

  const {
    name,
    email,
    password,
    phoneNumber,
    address,
    latitude,
    longitude,
    proofType,
  } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !phoneNumber ||
    !address ||
    !latitude ||
    !longitude ||
    !proofType
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const existingVolunteer =
    await Volunteer.findOne({
      email,
    });

  if (existingVolunteer) {
    return res.status(400).json({
      success: false,
      message:
        "Volunteer already registered",
    });
  }

  const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );

  const volunteer =
    await Volunteer.create({

      name,
      email,

      password:
        hashedPassword,

      phoneNumber,

      address,

      latitude,

      longitude,

      proofType,

      proofImageUrl:
        req.file?.path || "",

    });

  res.status(201).json({
    success: true,
    message:
      "Volunteer registration submitted successfully. Waiting for admin approval.",
    volunteer,
  });

} catch (error) {

  console.error(error);

  res.status(500).json({
    success: false,
    message:
      "Volunteer registration failed",
  });

}

}
);

app.get(
  "/api/admin/pending-volunteers",
  async (req, res) => {

    try {

      const volunteers =
        await Volunteer.find({
          verificationStatus:
            "Pending",
        }).select("-password");

      res.json({
        success: true,
        volunteers,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch volunteers",
      });

    }

  }
);

app.patch(
  "/api/admin/approve-volunteer/:id",
  async (req, res) => {

    try {

      const volunteer =
        await Volunteer.findByIdAndUpdate(

          req.params.id,

          {
            isVerified: true,

            verificationStatus:
              "Approved",
          },

          {
            returnDocument:"after",
          }
        );

        io.emit(
        "VOLUNTEER_LIST_UPDATED"
      );


      if (!volunteer) {

        return res.status(404).json({
          success: false,
          message:
            "Volunteer not found",
        });

      }

      res.json({
        success: true,
        message:
          "Volunteer approved successfully",
        volunteer,
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
  "/api/admin/approved-volunteers",
  async (req, res) => {

    try {

      const volunteers =
        await Volunteer.find({
          verificationStatus:
            "Approved",
        }).select("-password");

      res.json({
        success: true,
        volunteers,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch volunteers",
      });

    }

  }
);

app.post(
  "/api/volunteer/login",
  async (req, res) => {

    try {

      const {
        email,
        password,
      } = req.body;

      const volunteer =
        await Volunteer.findOne({
          email,
        });

      if (!volunteer) {

        return res.status(404).json({
          success: false,
          message:
            "Volunteer not found",
        });

      }

      if (
        volunteer.verificationStatus !==
        "Approved"
      ) {

        return res.status(403).json({
          success: false,
          message:
            "Your account is awaiting admin approval",
        });

      }

      const isMatch =
        await bcrypt.compare(
          password,
          volunteer.password
        );

      if (!isMatch) {

        return res.status(401).json({
          success: false,
          message:
            "Invalid credentials",
        });

      }

      const token =
        jwt.sign(
          {
            volunteerId:
              volunteer._id,

            volunteerName:
              volunteer.name,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

      res.json({
        success: true,
        token,
        volunteer,
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

app.get(
  "/api/volunteer/escalated-cases",
  async (req, res) => {

    try {
    const reports =
    await Report.find({

      escalatedToVolunteers:
        true,

      status: {
        $in: [
          "Pending",
          "Volunteer Assigned",
        ],
      },

    }).sort({
    createdAt: -1,
  });

      res.json({
        success: true,
        reports,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
      });

    }

  }
);

app.patch(
  "/api/volunteer/accept-case/:id",
  async (req, res) => {

    try {

      const {
        volunteerId,
        volunteerName,
        volunteerPhone,
      } = req.body;

      const report =
  await Report.findOneAndUpdate(

    {
      _id: req.params.id,
      status: "Pending",
    },

    {
      assignedVolunteer: {
        volunteerId,
        volunteerName,
        volunteerPhone,
        volunteerType:
          "Emergency Volunteer",
      },

      volunteerAssignedAt:
        new Date(),

      status:
        "Volunteer Assigned",
    },

    {
      returnDocument: "after",
    }
  );

if (!report) {

  return res.status(400).json({
    success: false,
    message:
      "Case already assigned",
  });

}

io.emit(
  "VOLUNTEER_ASSIGNED",
  report
);

io.to(
  `tracking_${report.trackingId}`
).emit(
  "CASE_UPDATED",
  report
);

    res.json({
        success: true,
        report,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
      });

    }

  }
);

app.patch(
  "/api/volunteer/mark-rescued/:id",
  async (req, res) => {

    try {

      const report =
        await Report.findByIdAndUpdate(

          req.params.id,

          {
            status: "Rescued",
            rescuedAt: new Date(),
          },

          {
             returnDocument: "after",
          }
        );

                console.log(
          "EMITTING RESCUED EVENT:",
          report.trackingId
        );

        io.emit(
      "CASE_RESCUED",
      report
    );
    io.to(
      `tracking_${report.trackingId}`
    ).emit(
      "CASE_UPDATED",
      report
    );

      res.json({
        success: true,
        report,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
      });

    }

  }
);
app.post(
  "/api/adoptions",
  upload.array(
  "images",
  5
),
  async (req, res) => {

    try {

      const adoption =
        await Adoption.create({

          animalName:
            req.body.animalName,

          animalType:
            req.body.animalType,

          breed:
            req.body.breed,

          age:
            req.body.age,

          gender:
            req.body.gender,

          vaccinationStatus:
            req.body.vaccinationStatus,

          foodHabits:
            req.body.foodHabits,

          petNature:
            req.body.petNature,

          description:
            req.body.description,

          location:
            req.body.location,

          contactNumber:
          req.body.contactNumber,

            images:
            req.files?.map(
              (file) => file.path
            ) || [],

        });
        
        io.emit(
      "NEW_ADOPTION_POST",
      adoption
    );

      res.json({
        success: true,
        adoption,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
      });

    }

  }
);

app.get(
  "/api/adoptions",
  async (req, res) => {

    try {

      const adoptions =
        await Adoption.find()
        .sort({
          createdAt: -1,
        });

      res.json({
        success: true,
        adoptions,
      });

    } catch (error) {

      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch adoption posts",
      });

    }

  }
);

app.patch(
  "/api/adoptions/:id/status",
  async (req, res) => {

    try {

      const adoption =
        await Adoption.findByIdAndUpdate(

          req.params.id,

          {
            adoptionStatus:
              req.body.status,
          },

          {
            new: true,
          }

        );

      io.emit(
        "ADOPTION_UPDATED",
        adoption
      );

      res.json({

        success: true,

        adoption,

      });

    } catch (error) {

      console.error(error);

      res.status(500).json({

        success: false,

      });

    }

  }
);

const server =
  createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "https://pawresq.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

io.on("connection", (socket) => {

  console.log(
    "NGO Connected:",
    socket.id
  );

 socket.on(
  "JOIN_NGO_ROOM",
  (ngoId) => {
    console.log(
    "JOIN_NGO_ROOM EVENT RECEIVED",
    ngoId
  );

    socket.join(
      `ngo_${ngoId}`
    );

    console.log(
      `NGO Joined Room: ngo_${ngoId}`
    );

  }
);
socket.on(
  "JOIN_TRACKING_ROOM",
  (trackingId) => {

    socket.join(
      `tracking_${trackingId}`
    );

    console.log(
      "Citizen Joined Tracking Room:",
      trackingId
    );

  }
);
  socket.on(
    "disconnect",
    () => {

      console.log(
        "NGO Disconnected:",
        socket.id
      );

    }
  );
});

setInterval(
  async () => {

    try {

      const pendingReports =
        await Report.find({
          status: "Pending",
          escalatedToVolunteers: false,
        });

            console.log(
        "Pending Reports Found:",
        pendingReports.length
      );

      for (
        const report of pendingReports
      ) {

        const ageInMinutes =
          (
            Date.now() -
            new Date(
              report.createdAt
            ).getTime()
          ) /
          (1000 * 60);
          console.log(
          "CHECKING:",
          report.trackingId,
          report.priorityLevel,
          report.status,
          report.escalatedToVolunteers,
          ageInMinutes
        );

        let shouldEscalate =
          false;

        if (
          report.priorityLevel ===
            "Emergency" &&
          ageInMinutes >= 2
        ) {
          shouldEscalate =
            true;
        }

        if (
          report.priorityLevel ===
            "Important" &&
          ageInMinutes >= 3
        ) {
          shouldEscalate =
            true;
        }

        if (
          shouldEscalate
        ) {

          report.escalatedToVolunteers = true;

          await report.save();

                io.emit(
              "NEW_ESCALATED_CASE",
              report
            );

          io.emit(
            "SPECIAL_VOLUNTEER_CASE_AVAILABLE",
            report
          );

          console.log(
            `Escalated Case: ${report.trackingId}`
          );


        }

      }

    } catch (error) {

      console.error(
        "Volunteer Escalation Error:",
        error
      );

    }

  },

  60000
);

server.listen(PORT, () => {

  console.log(
    `PawResQ backend running on http://localhost:${PORT}`
  );

});

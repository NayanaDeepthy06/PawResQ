import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    animalType: {
      type: String,
      required: true,
      trim: true,
    },
    injuryDescription: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rescued", "Closed"],
      default: "Pending",
    },
    severity: {
  type: String,
  enum: ["Low", "Medium", "High", "Critical"],
  default: "Low",
},
  severityScore: {
    type: Number,
    default: 20,
  },
  severityReasons: {
    type: [String],
    default: [],
  },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;

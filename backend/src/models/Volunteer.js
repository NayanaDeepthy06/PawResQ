import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    proofType: {
      type: String,
      required: true,
    },

    proofImageUrl: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationStatus: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
      ],
      default: "Pending",
    },
        acceptedCases: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Report",
    },
    ],

    availabilityStatus: {
      type: String,
      enum: [
        "Available",
        "Busy",
        "Offline",
      ],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

const Volunteer = mongoose.model(
  "Volunteer",
  volunteerSchema
);

export default Volunteer;
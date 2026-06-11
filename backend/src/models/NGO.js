import mongoose from "mongoose";

const ngoSchema = new mongoose.Schema(
  {
    ngoName: {
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
    isVerified: {
    type: Boolean,
    default: false,
    },

  latitude: {
  type: Number,
  required: true,
},

longitude: {
  type: Number,
  required: true,
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
  },
  {
    timestamps: true,
  }

);

const NGO = mongoose.model(
  "NGO",
  ngoSchema
);

export default NGO;
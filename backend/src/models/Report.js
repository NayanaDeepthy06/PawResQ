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
    landmark: {
      type: String,
      trim: true,
      default: "",
    },
    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },
    latitude:{
      type: Number,
      default: null,
    },
    longitude:{
      type: Number,
      default: null,
    },
    imageUrl:{
      type : String,
      default : "",
    },
   status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Volunteer Assigned",
        "Rescued",
        "Closed",
      ],
      default: "Pending",
    },

    acceptedAt: {
      type: Date,
      default: null,
    },

    acceptedByNGO: {

    ngoId: {
      type: String,
      default: null,
    },

    ngoName: {
      type: String,
      default: null,
    },

  },

  assignedVolunteer: {

    volunteerId: {
    type: String,
    default: null,
    },

    volunteerName: {
    type: String,
    default: null,
    },

    volunteerPhone: {
    type: String,
    default: null,
    },

    volunteerType: {
    type: String,
    enum: [
    "NGO",
    "Emergency Volunteer",
    ],
    default: null,
    },

},

    
    volunteerAssignedAt: {
      type: Date,
      default: null,
    },

rescuedAt: {
  type: Date,
  default: null,
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
 priorityScore: {
  type: Number,
  default: 20,
},
priorityLevel: {
  type: String,
  enum: ["Routine", "Important", "Urgent", "Emergency"],
  default: "Routine",
},
trackingId: {
  type: String,
  unique: true,
},

  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;

import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema(
  {
    animalName: {
      type: String,
      required: true,
    },

    animalType: {
      type: String,
      required: true,
    },

    breed: {
      type: String,
      default: "",
    },

    age: {
      type: String,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    vaccinationStatus: {
      type: String,
      required: true,
    },

    foodHabits: {
      type: String,
      default: "",
    },

    petNature: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      required: true,
    },

    contactNumber: {
      type: String,
      required: true,
    },

     adoptionStatus: {
      type: String,
      enum: [
        "Available",
        "Reserved",
        "Adopted",
      ],
      default: "Available",
    },

    images: {
    type: [String],
    default: [],
  },
   
    status: {
      type: String,
      enum: [
        "Available",
        "Reserved",
        "Adopted",
      ],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

const Adoption = mongoose.model(
  "Adoption",
  adoptionSchema
);

export default Adoption;
import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    patientType: {
      type: String,
    },
    iPDID: {
      type: Number,
    },
    iPDNumber: {
      type: String,
    },
    regId: {
      type: Number,
    },
    uhId: {
      type: String,
    },
    salutationName: {
      type: String,
    },
    name: {
      type: String,
    },
    gender: {
      type: String,
    },
    age: {
      type: Number,
    },
    mobileNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Patient =
  mongoose.models.Patient || mongoose.model("Patient", patientSchema);
export default Patient;

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
    uhid: {
      type: String,
    },
    salutationName: {
      type: String,
    },
    patientName: {
      type: String,
    },
    gender: {
      type: String,
    },
    ageY: {
      type: Number,
    },
    primaryMobileNumber: {
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

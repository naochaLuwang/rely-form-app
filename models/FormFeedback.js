import mongoose from "mongoose";

const formFeedbackSchema = new mongoose.Schema(
  {
    formId: {
      type: Number,
    },
    formName: {
      type: String,
    },
    formUrl: {
      type: String,
    },
    formType: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    isSubmitted: {
      type: Boolean,
    },
    submittedBy: {
      type: Number,
    },
    overallScore: {
      type: Number,
    },
    averageWeightage: {
      type: Number,
    },
    maximumWeightage: {
      type: Number,
    },
    minimumWeightage: {
      type: Number,
    },
    status: {
      type: String,
    },
    patient: {
      salutationName: String,
      name: String,
      regId: Number,
      patientType: String,
      ageY: Number,
      gender: String,
      email: String,
      primaryMobileNumber: Number,
      iPDNumber: String,
      uhid: String,
    },
    form: [
      {
        label: String,
        labelText: String,
        text: String,
        inputType: String,
        value: Number,
        required: Boolean,
        placeholderText: String,
        weightage: Number,
        style: {
          label: Boolean,
          fontSize: String,
          weight: Boolean,
          italic: Boolean,
          underline: Boolean,
          alignment: String,
        },
        options: [
          {
            optionText: String,
            weightage: Number,
            isChecked: Boolean,
          },
        ],
        ansText: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const FormFeedback =
  mongoose.models.FormFeedback ||
  mongoose.model("FormFeedback", formFeedbackSchema);

module.exports = FormFeedback;

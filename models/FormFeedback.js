import mongoose from "mongoose";

const formFeedbackSchema = new mongoose.Schema(
  {
    formId: {
      type: String,
    },
    formName: {
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
    patient: {
      name: String,
      regId: Number,
      patientType: String,
      ageY: Number,
      gender: String,
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
        questionNo: Number,
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
export default FormFeedback;

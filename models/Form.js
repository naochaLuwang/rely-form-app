import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
  {
    formId: {
      type: String,
    },
    formName: {
      type: String,
    },
    formDescription: {
      type: String,
    },
    createdBy: {
      type: String,
    },
    formType: {
      type: String,
    },
    status: {
      type: Boolean,
    },
    minimumWeightage: {
      type: Number,
    },
    maximumWeightage: {
      type: Number,
    },
    averageWeightage: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
    },
    form: [
      {
        label: String,
        labelText: String,
        text: String,
        inputType: String,
        required: Boolean,
        placeholderText: String,
        questionNo: Number,
        value: Number,
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
            weightage: Number,
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

const Form = mongoose.models.Form || mongoose.model("Form", formSchema);
export default Form;

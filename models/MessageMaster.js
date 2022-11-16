import mongoose from "mongoose";

const messageMasterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    mobileNumber: {
      type: Number,
    },
    formId: {
      type: Number,
    },
    formName: {
      type: String,
    },
    averageScore: {
      type: Number,
    },
    overallScore: {
      type: Number,
    },
    message: {
      type: String,
    },
    isRead: {
      type: Boolean,
    },
    status: {
      type: String,
    },
    feedbackId: {
      type: String,
    },
  },
  { timestamps: true }
);

const MessageMaster =
  mongoose.models.MessageMaster ||
  mongoose.model("MessageMaster", messageMasterSchema);

module.exports = MessageMaster;

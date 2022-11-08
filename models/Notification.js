import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    mobileNumber: {
      type: Number,
    },
    formId: {
      type: String,
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
  },
  { timestamps: true }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

module.exports = Notification;

import nc from "next-connect";
import dbConnect from "../../utils/db";

import Notification from "../../models/Notification";

const handler = nc();

handler.get(async (req, res) => {
  try {
    await dbConnect();

    const response = await Notification.find({});
    res.json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

handler.post(async (req, res) => {
  try {
    await dbConnect();

    const { name, mobileNumber, formId, formName, averageScore, overallScore } =
      req.body;

    const newNotification = await new Notification({
      name,
      mobileNumber,
      formId,
      formName,
      averageScore,
      overallScore,
      message: `You have just received a low feedback for ${formName} by ${name}  with score ${overallScore}`,
      isRead: fase,
    });

    await newNotification.save();
    res.json(newNotification);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default handler;

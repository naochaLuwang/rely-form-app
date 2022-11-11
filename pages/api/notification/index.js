import nc from "next-connect";
import dbConnect from "../../../utils/db";
import MessageMaster from "../../../models/MessageMaster";

const handler = nc();

handler.get(async (req, res) => {
  try {
    await dbConnect();

    const response = await MessageMaster.find({}).sort({ createdAt: -1 });
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

    const newNotification = await new MessageMaster({
      name,
      mobileNumber,
      formId,
      formName,
      averageScore,
      overallScore,
      status: "QUEUED",
      message: `You have just received a low feedback for ${formName} by ${name}  with score ${overallScore}`,
      isRead: false,
    });

    await newNotification.save();
    res.json(newNotification);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

handler.put(async (req, res) => {
  try {
    await dbConnect();
    const { mobileNumber } = req.body;

    const response = await MessageMaster.findOneAndUpdate(
      {
        mobileNumber,
      },
      { isRead: true }
    );
    res.json(response);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

export default handler;

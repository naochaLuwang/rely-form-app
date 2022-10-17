import nc from "next-connect";
import FormFeedback from "../../../models/FormFeedback";
import dbConnect from "../../../utils/db";

const handler = nc();

handler.get(async (req, res) => {
  try {
    await dbConnect();
    const response = await FormFeedback.find();
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default handler;

import nc from "next-connect";
import FormFeedback from "../../../models/FormFeedback";
import db from "../../../utils/db";

const handler = nc();

handler.get(async (req, res) => {
  try {
    await db.connect();
    const response = await FormFeedback.find();
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default handler;

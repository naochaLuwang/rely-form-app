import nc from "next-connect";
import FormFeedback from "../../../../models/FormFeedback";

import dbConnect from "../../../../utils/db";

const handler = nc();

handler.get(async (req, res) => {
  try {
    await dbConnect();
    const formFeedback = await FormFeedback.find({
      formId: req.query.id,
    });
    res.json(formFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default handler;

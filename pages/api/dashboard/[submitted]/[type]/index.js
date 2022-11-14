import nc from "next-connect";

import dbConnect from "../../../../../utils/db";

import FormFeedback from "../../../../../models/FormFeedback";

const handler = nc();

handler.get(async (req, res) => {
  try {
    await dbConnect();

    const data = await FormFeedback.find({
      isSubmitted: req.query.submitted,
      formType: req.query.type,
    }).sort({ updatedAt: -1 });

    res.json(data);
  } catch (error) {
    return res.statusCode(500).json({ error: error.message });
  }
});

export default handler;

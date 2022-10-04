import nc from "next-connect";

import FormFeedback from "../../../../../models/FormFeedback";
import db from "../../../../../utils/db";

const handler = nc();

handler.get(async (req, res) => {
  console.log(req.query.id);

  console.log(req.query.regId);

  try {
    await db.connect();
    const data = await FormFeedback.findOne({
      submittedBy: req.query.regId,
      formId: req.query.id,
    });
    res.json(data);
    await db.disconnect();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default handler;

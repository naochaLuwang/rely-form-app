import nc from "next-connect";
import FormFeedback from "../../../../models/FormFeedback";

import db from "../../../../utils/db";

const handler = nc();

handler.put(async (req, res) => {
  const { isSubmitted, overallScore, formDatas } = req.body;
  try {
    await db.connect();
    const response = await FormFeedback.findOneAndUpdate(
      {
        submittedBy: req.query.id,
      },
      {
        isSubmitted: isSubmitted,
        overallScore: overallScore,
        form: formDatas,
      }
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default handler;

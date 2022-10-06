import nc from "next-connect";
import FormFeedback from "../../../../models/FormFeedback";

import dbConnect from "../../../../utils/db";

const handler = nc();

handler.put(async (req, res) => {
  const { isSubmitted, overallScore, formDatas } = req.body;
  try {
    await dbConnect();
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

handler.get(async (req, res) => {
  try {
    await dbConnect();
    const formFeedback = await FormFeedback.find({
      formId: req.query.id,
    });
    await res.json(formFeedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default handler;

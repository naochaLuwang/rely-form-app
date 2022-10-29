import nc from "next-connect";

import FormFeedback from "../../../../../models/FormFeedback";
import dbConnect from "../../../../../utils/db";

const handler = nc();

handler.put(async (req, res) => {
  const { isSubmitted, overallScore, formDatas } = req.body;
  try {
    await dbConnect();

    const response = await FormFeedback.findOneAndUpdate(
      {
        formId: req.query.id,
        submittedBy: req.query.regId,
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
  console.log(req.query.id);

  console.log(req.query.regId);

  try {
    await dbConnect();
    const data = await FormFeedback.findOne({
      submittedBy: req.query.regId,
      formId: req.query.id,
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default handler;

import nc from "next-connect";

import Form from "../../../../models/Form";
import FormFeedback from "../../../../models/FormFeedback";
import db from "../../../../utils/db";

const handler = nc();

handler.delete(async (req, res) => {
  await db.connect();
  const form = await Form.findOne({ formId: req.query.id });
  if (form) {
    await form.remove();
    await db.disconnect();
    res.send({ message: "Form Deleted" });
    await db.disconnect();
  } else {
    res.status(404).send({ message: "Form Not Found" });
  }
});

handler.get(async (req, res) => {
  console.log(req.query.id);
  try {
    await db.connect();
    const data = await FormFeedback.find({ formId: req.query.id });
    res.json(data);
    await db.disconnect();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

handler.put(async (req, res) => {
  try {
    const { status } = req.body;
    await db.connect();
    const data = await Form.findOneAndUpdate(
      { formId: req.query.id },
      {
        status: status,
      }
    );

    res.json(data);
    console.log(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
});

export default handler;

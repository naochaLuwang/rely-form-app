import nc from "next-connect";

import Form from "../../../../models/Form";
import FormFeedback from "../../../../models/FormFeedback";
import dbConnect from "../../../../utils/db";

const handler = nc();

handler.delete(async (req, res) => {
  await dbConnect();
  const form = await Form.findOne({ formId: req.query.id });
  if (form) {
    await form.remove();

    res.send({ message: "Form Deleted" });
  } else {
    res.status(404).send({ message: "Form Not Found" });
  }
});

handler.get(async (req, res) => {
  console.log(req.query.id);
  try {
    await dbConnect();
    const data = await FormFeedback.find({ formId: req.query.id });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

handler.put(async (req, res) => {
  try {
    const { status, isDeleted, type } = req.body;
    await dbConnect();

    // const activeForms = await Form.find({ status: true })

    const disable = await Form.updateMany(
      { status: true, formType: type },
      { status: false }
    );
    const data = await Form.findOneAndUpdate(
      { formId: req.query.id },
      {
        status: status,
        isDeleted: isDeleted,
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

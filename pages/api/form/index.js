import nc from "next-connect";

import Form from "../../../models/Form";
import dbConnect from "../../../utils/db";

const handler = nc();

handler.post(async (req, res) => {
  try {
    await dbConnect();

    const {
      formId,
      formData,
      formName,
      formDescription,
      createdBy,
      formType,
      status,
      minimumWeightage,
      maximumWeightage,
      averageWeightage,
      isDeleted,
    } = req.body;

    const form = await Form.findOne({ formId: formId });
    if (form) {
      return res.status(404).send({ message: "Form already exist" });
    }

    const newForm = await new Form({
      formId,
      formName,
      formDescription,
      createdBy,
      formType,
      status,
      minimumWeightage,
      maximumWeightage,
      averageWeightage,
      isDeleted,
      form: formData,
    });
    await newForm.save();
    res.json(newForm);
    await db.disconnect();
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
});

handler.get(async (req, res) => {
  try {
    await dbConnect();
    const data = await Form.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default handler;

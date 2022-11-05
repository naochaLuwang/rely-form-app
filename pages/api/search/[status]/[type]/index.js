import nc from "next-connect";
import Form from "../../../../../models/Form";
import dbConnect from "../../../../../utils/db";

const handler = nc();

handler.get(async (req, res) => {
  console.log(req.query.status);
  console.log(req.query.type);
  try {
    await dbConnect();
    const data = await Form.find({
      status: req.query.status,
      formType: req.query.type,
    }).sort({ updatedAt: -1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default handler;

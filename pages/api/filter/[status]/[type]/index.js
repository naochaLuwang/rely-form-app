import Form from "../../../../../models/Form";

import nc from "next-connect";

import dbConnect from "../../../../../utils/db";
import { status } from "nprogress";

const handler = nc();

handler.get(async (req, res) => {
  try {
    await dbConnect();
    const data = await Form.find({
      formType: req.query.type,
      status: req.query.status,
    });

    res.json(data);
  } catch (error) {
    res.statusCode(500).json({ error: error.message });
  }
});

export default handler;

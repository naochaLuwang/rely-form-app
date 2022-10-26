import nc from "next-connect";

import dbConnect from "../../utils/db";
import User from "../../models/User";
import bcrypt from "bcrypt";

const handler = nc();

handler.post(async (req, res) => {
  try {
    await dbConnect();
    const { email, password, name, userId } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await new User({
      name,
      email,
      userId,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(200).json(newUser);
  } catch (error) {
    return res.statusCode(500).json({ error: error.message });
  }
});

export default handler;

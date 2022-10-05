import nc from "next-connect";
import dbConnect from "../../utils/db";

import Patient from "../../models/Patient";

const handler = nc();

handler.post(async (req, res) => {
  try {
    await dbConnect();
    const {
      patientType,
      iPDID,
      iPDNumber,

      regId,
      uhid,
      salutationName,
      patientName,
      gender,
      ageY,
      primaryMobileNumber,
    } = req.body;

    const newPatient = await new Patient({
      patientType,
      iPDID,
      iPDNumber,
      regId,
      uhid,
      salutationName,
      patientName,
      gender,
      ageY,
      primaryMobileNumber,
    });

    await newPatient.save();
    res.json(newPatient);
    await db.disconnect();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default handler;

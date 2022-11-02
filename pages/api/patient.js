import nc from "next-connect";
import dbConnect from "../../utils/db";

import Patient from "../../models/Patient";

const handler = nc();

const patientData = [];

handler.post(async (req, res) => {
  try {
    await dbConnect();
    const { patients } = req.body;

    for (let i = 0; i < patients.length; i++) {
      const response = await Patient.findOne({
        patientType: patients[i].patientType,
        regId: patients[i].regId,
      });

      if (!response) {
        patientData.push({
          name: patients[i].name,
          gender: patients[i].gender,
          age: patients[i].age,
          regId: patients[i].regId,
          uhId: patients[i].uhId,
          salutationName: patients[i].salutationName,
          patientType: patients[i].patientType,
        });
      }
    }

    if (patientData) {
      const newPatient = await Patient.insertMany(patientData);

      return res.status(200).json(newPatient);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default handler;

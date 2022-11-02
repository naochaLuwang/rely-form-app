import nc from "next-connect";
import dbConnect from "../../utils/db";
import Form from "../../models/Form";
import Patient from "../../models/Patient";
import FormFeedback from "../../models/FormFeedback";

const handler = nc();

let feedbackData = [];
handler.post(async (req, res) => {
  try {
    await dbConnect();

    const ipdForm = await Form.findOne({ formType: "IPD", status: true });

    const opdForm = await Form.findOne({ formType: "OPD", status: true });

    const patient = await Patient.find();
    console.log(patient);

    for (let i = 0; i < patient.length; i++) {
      if (patient[i].patientType === "IPD") {
        const feedbackIpd = await FormFeedback.findOne({
          submittedBy: patient[i].regId,
          formId: ipdForm.formId,
        });

        if (!feedbackIpd) {
          feedbackData.push({
            formId: ipdForm.formId,
            formName: ipdForm.formName,
            formUrl: `https://rely-form.herokuapp.com/form/${
              ipdForm.formId
            }?regId=${Buffer.from(`${patient[i].regId}`, "binary").toString(
              "base64"
            )}`,

            averageWeightage: ipdForm.averageWeightage,
            maximumWeightage: ipdForm.maximumWeightage,
            minimumWeightage: ipdForm.minimumWeightage,
            createdBy: ipdForm.createdBy,
            isSubmitted: false,
            submittedBy: patient[i].regId,
            overallScore: 0,
            patient: {
              salutationName: patient[i].salutationName,
              name: patient[i].name,
              regId: patient[i].regId,
              patientType: patient[i].patientType,
              ageY: patient[i].age,
              gender: patient[i].gender,
              primaryMobileNumber: patient[i].mobileNumber,
              iPDNumber: patient[i].iPDNumber,
              uhid: patient[i].uhId,
            },
            form: ipdForm.form,
          });
        }
      } else if (patient[i].patientType === "OPD") {
        const feedbackOpd = await FormFeedback.findOne({
          submittedBy: patient[i].regId,
          formId: opdForm.formId,
        });

        if (!feedbackOpd) {
          feedbackData.push({
            formId: opdForm.formId,
            formName: opdForm.formName,
            formUrl: `https://rely-form.herokuapp.com/form/${
              opdForm.formId
            }?regId=${Buffer.from(`${patient[i].regId}`, "binary").toString(
              "base64"
            )}`,

            averageWeightage: opdForm.averageWeightage,
            maximumWeightage: opdForm.maximumWeightage,
            minimumWeightage: opdForm.minimumWeightage,
            createdBy: opdForm.createdBy,
            isSubmitted: false,
            submittedBy: patient[i].regId,
            overallScore: 0,
            patient: {
              salutationName: patient[i].salutationName,
              name: patient[i].name,
              regId: patient[i].regId,
              patientType: patient[i].patientType,
              ageY: patient[i].age,
              gender: patient[i].gender,
              primaryMobileNumber: patient[i].mobileNumber,
              iPDNumber: patient[i].iPDNumber,
              uhid: patient[i].uhId,
            },
            form: opdForm.form,
          });
        }
      }
    }

    console.log(feedbackData.length);

    const newFeedback = await FormFeedback.insertMany(feedbackData);
    return res.status(200).json(newFeedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default handler;

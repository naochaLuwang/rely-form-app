import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast, { Toaster } from "react-hot-toast";
import Success from "../../success";
import Slider from "@mui/material/Slider";
import axios from "axios";
import FormFeedback from "../../../models/FormFeedback";
import dbConnect from "../../../utils/db";

import Loader from "../../../components/Loader";

const FormFeedbackPage = ({ formFeedback }) => {
  const [formData, setFormData] = useState(formFeedback);
  const [newForm, setNewForm] = useState(formData);
  const [minimumScore, setMinimumScore] = useState(0);
  const [maximumScore, setMaximumScore] = useState(0);
  const [averageScore, setAverageScore] = useState(0);

  const formDatas = newForm?.form;
  const router = useRouter();

  const handleChange = (e, i, j) => {
    const newFormData = { ...newForm };
    newFormData.form[i].ansText = e.target.value;
    newFormData.form[i].weightage = newFormData.form[i].options[j].weightage;
    setNewForm(newFormData);

    console.log(newForm);
  };

  const handleCheckBox = (i, j) => {
    const newFormData = { ...newForm };
    newFormData.form[i].options[j].isChecked =
      !newFormData.form[i].options[j].isChecked;
    setNewForm(newFormData);
    console.log(newForm);
  };

  const updateRange = (value, index) => {
    let newRange = { ...newForm };
    newRange.form[index].value = value;
    setFormData(newRange);
    console.log(newRange);
  };
  const handleSubmit = async () => {
    let overallScore = 0;

    const newFormData = { ...newForm };
    console.log(newFormData);

    const filteredData = newFormData.form.filter((element) =>
      element.inputType.includes("radio")
    );
    // console.log(filteredData);

    filteredData.map((element) => {
      overallScore += element.weightage;
      return overallScore;
    });

    const scoreWeightage = Math.round(overallScore / filteredData.length);

    const requiredFields = newFormData.form.filter(
      (element) => element.required
    );

    console.log(requiredFields);

    const filledFields = newFormData.form.filter(
      (element) => element.required && element.ansText !== ""
    );
    console.log(filledFields);

    if (requiredFields.length !== filledFields.length) {
      return alert("Please fill all the required fields *");
    }

    const res = await axios.put(`/api/formFeedback/${newForm.patient.regId}`, {
      isSubmitted: true,

      overallScore: scoreWeightage,
      formDatas,
    });
    toast("Form saved successfully", { type: "success" });

    router.push("/success");
  };

  const changeText = (text, i) => {
    let newText = { ...formData };
    newText.form[i].text = text;
    setFormData(newText);

    console.log(newText.form[i].text);
  };

  return (
    <>
      <Toaster />

      {/* <FormHeader /> */}
      {formData?.isSubmitted ? (
        <Success />
      ) : (
        <div className="max-w-screen h-auto bg-slate-100  lg:py-10 py-2 lg:px-10 px-2  lg:block">
          <div className="max-w-screen lg:max-w-4xl mx-auto">
            <div className="w-full h-2 bg-blue-500 rounded-t-lg"></div>
            <div className="w-full border px-8 lg:px-10 py-5 relative bg-white mb-5 rounded-lg shadow-sm">
              <h1 className="text-lg lg:text-4xl font-bold mb-10">
                {formData?.formName}
              </h1>
              {/* <p className="absolute top-16">
                Signed in as {session?.user?.email}
              </p> */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between lg:pr-10 -mt-5">
                <div className="flex flex-col">
                  <h1 className="lg:tracking-wider text-sm">
                    <span className="font-semibold">Patient Name :</span>{" "}
                    {newForm?.patient.name}
                  </h1>
                  <h1 className="tracking-wider">
                    <span className="font-semibold">Age :</span>{" "}
                    {newForm?.patient.ageY}
                  </h1>
                  <h1 className="tracking-wider">
                    <span className="font-semibold">Gender :</span>{" "}
                    {newForm?.patient.gender}
                  </h1>
                  <h1 className="tracking-wider">
                    <span className="font-semibold">Mobile :</span>{" "}
                    {newForm?.patient.primaryMobileNumber}
                  </h1>
                </div>
                <div className="flex flex-col">
                  <h1 className="tracking-wider">
                    {" "}
                    <span className="font-semibold">Patient Type :</span>{" "}
                    {newForm?.patient.patientType}
                  </h1>
                  <h1 className="tracking-wider">
                    <span className="font-semibold">IPD Number :</span>{" "}
                    {newForm?.patient.iPDNumber}
                  </h1>
                  {/* <h1 className="tracking-wider">
                    <span className="font-semibold">Reg Id :</span>{" "}
                    {newForm?.patient.regId}
                  </h1> */}
                  <h1 className="tracking-wider">
                    <span className="font-semibold">UHID :</span>{" "}
                    {newForm?.patient.uhid}
                  </h1>
                </div>
              </div>
            </div>

            {newForm?.form?.map((element, i) => {
              switch (element.inputType) {
                case "text":
                  return (
                    <div
                      key={i}
                      className="flex flex-col space-y-2 lg:mb-5 mb-2  bg-white px-10 py-4 rounded-lg shadow-sm"
                    >
                      {!formData.form[i].style.label && (
                        <div className="flex ">
                          <h1 className="lg:text-lg text-sm font-bold">
                            <span>
                              {i + 1}
                              {". "}
                            </span>
                            {formData.form[i].labelText}
                          </h1>
                          {formData.form[i].required && (
                            <h1 className="text-red-500 text-xl font-bold ml-2">
                              *
                            </h1>
                          )}
                        </div>
                      )}
                      <h1
                        className=" text-lg font-bold"

                        // onChange={(e) => changeText(e.target.value, i)}
                      >
                        {formData.form[i].text}
                      </h1>
                    </div>
                  );

                case "number":
                  return (
                    <div
                      key={i}
                      className="flex flex-col space-y-2 mb-5 border bg-white px-10 py-4 rounded-lg shadow-sm"
                    >
                      {!formData.form[i].style.label && (
                        <div className="flex ">
                          <h1 className="text-lg font-bold">
                            <span>
                              {i + 1}
                              {". "}
                            </span>
                            {formData.form[i].labelText}
                          </h1>
                          {formData.form[i].required && (
                            <h1 className="text-red-500 text-xl font-bold ml-2">
                              *
                            </h1>
                          )}
                        </div>
                      )}
                      <input
                        className="form-input w-96 rounded-md border focus:border-gray-400 bg-transparent  focus:outline-0 focus:ring-0"
                        type={formData.form[i].inputType}
                        value={formData.form[i].text}
                        onChange={(e) => changeText(e.target.value, i)}
                      />
                    </div>
                  );

                case "multiline":
                  return (
                    <div
                      key={i}
                      className="flex flex-col space-y-2 mb-5 border bg-white rounded-lg shadow-sm px-10 py-4"
                    >
                      {!formData.form[i].style.label && (
                        <div className="flex ">
                          <h1 className="text-lg font-bold">
                            <span>
                              {i + 1}
                              {". "}
                            </span>
                            {formData.form[i].labelText}
                          </h1>
                          {formData.form[i].required && (
                            <h1 className="text-red-500 text-xl font-bold ml-2">
                              *
                            </h1>
                          )}
                        </div>
                      )}

                      <textarea
                        className="w-full bg-transparent"
                        rows="10"
                        value={formData.form[i].text}
                        onChange={(e) => changeText(e.target.value, i)}
                      ></textarea>
                    </div>
                  );

                case "name":
                  return (
                    <div key={i} className=" flex items-center space-x-2 mb-5">
                      <h1>Name :</h1>
                      <input
                        type="text"
                        className="form-input border-0 w-96 outline-0 py-0 focus:ring-0 bg-transparent border-b-2"
                        value={formData.form[i].text}
                        placeholder="Enter your name"
                        onChange={(e) => changeText(e.target.value, i)}
                      />
                    </div>
                  );

                case "email":
                  return (
                    <div key={i} className="flex items-center space-x-2 mb-5">
                      <h1>Email :</h1>
                      <input
                        type="text"
                        className="form-input w-96 border-0 outline-0 py-0 focus:ring-0 bg-transparent border-b-2"
                        value={formData.form[i].text}
                        placeholder="Enter your email"
                        onChange={(e) => changeText(e.target.value, i)}
                      />
                    </div>
                  );

                case "radio":
                  return (
                    <div
                      key={i}
                      className="flex flex-col space-y-2 lg:mb-5 mb-2 border bg-white px-10 py-4 rounded-lg shadow-sm"
                    >
                      <div className="flex ">
                        <h1 className="lg:text-lg text-base font-bold">
                          <span className="lg:text-lg text-base">{i} .</span>
                          {formData.form[i].text}
                        </h1>
                        {formData.form[i].required && (
                          <h1 className="text-red-500 text-xl font-bold ml-2">
                            *
                          </h1>
                        )}
                      </div>
                      {element.options.map((option, j) => {
                        return (
                          <div key={j} className="flex items-center space-x-3">
                            <input
                              type={formData.form[i].inputType}
                              value={option.optionText}
                              required={formData.form[i].required}
                              checked={
                                newForm.form[i].ansText === option.optionText &&
                                newForm.form[i].weightage === option.weightage
                              }
                              onChange={(e) => handleChange(e, i, j)}
                            />
                            <p className="lg:text-base text-sm font-medium">
                              {option.optionText}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  );

                case "checkbox":
                  return (
                    <div
                      key={i}
                      className="flex flex-col space-y-2 lg:mb-5 mb-2 border bg-white px-10 py-4 rounded-lg shadow-sm"
                    >
                      <div className="flex ">
                        <h1 className="lg:text-lg text-base font-bold">
                          <span>
                            {i}
                            {". "}
                          </span>
                          {formData.form[i].text}
                        </h1>
                        {formData.form[i].required && (
                          <h1 className="text-red-500 text-xl font-bold ml-2">
                            *
                          </h1>
                        )}
                      </div>
                      {element.options.map((option, j) => {
                        return (
                          <div key={j} className="flex items-center space-x-3">
                            <input
                              type={formData.form[i].inputType}
                              value={option.optionText}
                              checked={
                                newForm.form[i].options[j].isChecked === true
                              }
                              onChange={() => handleCheckBox(i, j)}
                            />
                            <p className="lg:text-base text-sm font-medium">
                              {option.optionText}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  );

                case "range":
                  return (
                    <div key={i} className="flex flex-col space-y-2 mb-5">
                      <h1>{formData.form[i].text}</h1>
                      <Slider
                        defaultValue={0}
                        aria-label="Default"
                        valueLabelDisplay="auto"
                        onChange={(e, value) => {
                          updateRange(value, i);
                        }}
                      />
                    </div>
                  );

                default:
                  <h1>Sorry</h1>;
              }
            })}

            <div className="flex items-center justify-center mt-4 lg:justify-start mb-4">
              <p
                onClick={handleSubmit}
                className="relative inline-flex items-center justify-start  px-32 lg:px-12 py-4 overflow-hidden font-medium transition-all bg-blue-500 rounded-xl group cursor-pointer"
              >
                <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-blue-700 rounded group-hover:-mr-4 group-hover:-mt-4">
                  <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                </span>
                <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full translate-y-full bg-blue-600 rounded-2xl group-hover:mb-12 group-hover:translate-x-0"></span>
                <span className="relative w-full text-left font-bold text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                  Submit
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormFeedbackPage;

export async function getServerSideProps(context) {
  const { params, query } = context;
  const { fid } = params;
  const { regId } = query;

  const decryptedId = Buffer.from(regId, "base64").toString("binary");

  console.log(query);

  // const formFeedback = await fetch(
  //   `${process.env.HOST_URL}/api/formFeedback/${fid}/${decryptedId}`
  // );
  // const data = await formFeedback.json();

  // console.log(data);

  await dbConnect();

  const response = await FormFeedback.findOne({
    submittedBy: decryptedId,
    formId: fid,
  });

  console.log(response);

  return {
    props: {
      formFeedback: JSON.parse(JSON.stringify(response)),
    },
  };
}

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
// import toast, { Toaster } from "react-hot-toast";
import CloseIcon from "@mui/icons-material/Close";
import Slider from "@mui/material/Slider";
import axios from "axios";
import Router from "next/router";
import { RotatingLines } from "react-loader-spinner";
import FormFeedback from "../../../models/FormFeedback";
import dbConnect from "../../../utils/db";
import Success from "../../success";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";

import { Dialog, DialogTitle, IconButton } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
const FormFeedbackPage = ({ formFeedback }) => {
  const [formData, setFormData] = useState(formFeedback);
  const [newForm, setNewForm] = useState(formData);
  const [loading, setLoading] = useState(false);
  const [unfilled, setUnfilled] = useState(false);

  const router = useRouter();

  const formDatas = newForm?.form;

  const handleChange = (e, i, j) => {
    const newFormData = { ...newForm };
    newFormData.form[i].ansText = e.target.value;
    newFormData.form[i].weightage = newFormData.form[i].options[j].weightage;
    setNewForm(newFormData);

    console.log(newForm);
  };

  const handleCheckBox = (i, j, e) => {
    const newFormData = { ...newForm };

    newFormData.form[i].options[j].isChecked =
      !newFormData.form[i].options[j].isChecked;

    if (newFormData.form[i].options[j].isChecked === true) {
      newFormData.form[i].ansText = e.target.value;
    } else {
      newFormData.form[i].ansText = "";
    }
    setNewForm(newFormData);
    console.log(newForm);
  };

  const handleClose = () => {
    setLoading(false);
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

    console.log(requiredFields.length);
    console.log(filledFields.length);

    if (requiredFields.length !== filledFields.length) {
      setUnfilled(true);
      return;
    } else {
      setUnfilled(false);
      setLoading(true);
    }

    // setLoading(true);

    // console.log(newForm);

    if (scoreWeightage < newForm.averageWeightage) {
      const data = await axios.post("/api/notification", {
        name: newForm.patient.name,
        mobileNumber: newForm.patient.primaryMobileNumber,
        formId: newForm.formId,
        formName: newForm.formName,
        averageScore: newForm.averageWeightage,
        overallScore: scoreWeightage,
        status: "QUEUED",
        feedbackId: newForm._id,
      });

      console.log(data);
    }

    const res = await axios.put(
      `/api/formFeedback/${newForm.formId}/${newForm.patient.primaryMobileNumber}`,
      {
        isSubmitted: true,

        overallScore: scoreWeightage,
        formDatas,
      }
    );

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
      {formData?.isSubmitted ? (
        <Success />
      ) : (
        <div className="max-w-screen h-auto bg-slate-100  lg:py-10 py-2 lg:px-10 px-2  lg:block">
          <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={loading}
          >
            <div className="w-96 h-auto py-6 flex flex-col items-center justify-center">
              <RotatingLines
                strokeColor="blue"
                strokeWidth="5"
                animationDuration="0.75"
                width="60"
                visible={true}
              />
              <p>Submitting Form ...</p>
            </div>
          </BootstrapDialog>
          <div className="max-w-screen lg:max-w-4xl mx-auto">
            <div className="w-full h-2 bg-blue-500 rounded-t-lg"></div>
            <div className="w-full border px-8 lg:px-10 py-5 relative bg-white mb-5 rounded-lg shadow-sm">
              <h1 className="text-lg lg:text-2xl text-gray-600 font-bold mb-10">
                {formData?.formName}
              </h1>
              {/* <p className="absolute top-16">
                Signed in as {session?.user?.email}
              </p> */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between lg:pr-10 -mt-5">
                <div className="flex flex-col">
                  <h1 className="lg:tracking-wider text-sm">
                    <span className="font-semibold text-sm text-gray-600">
                      Name :
                    </span>{" "}
                    {newForm?.patient.name}
                  </h1>
                  <h1 className="tracking-wider text-sm">
                    <span className="font-semibold text-sm text-gray-600 ">
                      Age :
                    </span>{" "}
                    {newForm?.patient.ageY}
                  </h1>
                  <h1 className="tracking-wider text-sm">
                    <span className="font-semibold text-sm text-gray-600">
                      Gender :
                    </span>{" "}
                    {newForm?.patient.gender}
                  </h1>
                  <h1 className="tracking-wider text-sm text-gray-600">
                    <span className="font-semibold text-sm">Mobile :</span>{" "}
                    {newForm?.patient.primaryMobileNumber}
                  </h1>
                </div>
                <div className="flex flex-col">
                  <h1 className="tracking-wider text-sm ">
                    {" "}
                    <span className="font-semibold text-sm text-gray-600">
                      Type :
                    </span>{" "}
                    {newForm?.patient.patientType}
                  </h1>
                  <h1 className="tracking-wider text-sm">
                    <span className="font-semibold text-sm text-gray-600">
                      IPD Number :
                    </span>{" "}
                    {newForm?.patient.iPDNumber}
                  </h1>
                  {/* <h1 className="tracking-wider">
                    <span className="font-semibold">Reg Id :</span>{" "}
                    {newForm?.patient.regId}
                  </h1> */}
                  <h1 className="tracking-wider text-sm">
                    <span className="font-semibold text-gray-600 text-sm">
                      UHID :
                    </span>{" "}
                    {newForm?.patient.uhid}
                  </h1>
                </div>
              </div>
            </div>

            {newForm?.form?.map((element, i) => {
              switch (element.inputType) {
                case "label":
                  return (
                    <div
                      key={i}
                      className="flex flex-col space-y-2 mb-5 border bg-white px-10 py-4 rounded-lg shadow-sm"
                    >
                      <h1 className="text-lg font-semibold text-gray-600">
                        {formData.form[i].label}
                      </h1>
                    </div>
                  );
                case "text":
                  return (
                    <div
                      key={i}
                      className="flex flex-col space-y-2 mb-5 border bg-white px-10 py-4 rounded-lg shadow-sm"
                    >
                      {!formData.form[i].style.label && (
                        <div className="flex ">
                          <h1 className="text-sm font-semibold text-gray-700">
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

                case "number":
                  return (
                    <div
                      key={i}
                      className="flex flex-col space-y-2 mb-5 border bg-white px-10 py-4 rounded-lg shadow-sm"
                    >
                      {!formData.form[i].style.label && (
                        <div className="flex ">
                          <h1 className="text-sm font-semibold text-gray-700">
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
                          <h1 className="text-sm  font-semibold text-gray-700">
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
                        className="w-full bg-transparent rounded-md"
                        rows="5"
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
                        <h1
                          className={
                            unfilled &&
                            formData.form[i].required &&
                            formData.form[i].ansText == ""
                              ? "lg:text-base text-red-500 text-sm font-semibold "
                              : "lg:text-base text-sm text-gray-700 font-semibold"
                          }
                        >
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
                            <p className="lg:text-base text-sm font-medium text-gray-600">
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
                        <h1
                          className={
                            unfilled &&
                            formData.form[i].required &&
                            formData.form[i].ansText == ""
                              ? "lg:text-base text-red-500 text-sm font-semibold "
                              : "lg:text-base text-sm text-gray-700 font-semibold"
                          }
                        >
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
                              onChange={(e) => handleCheckBox(i, j, e)}
                            />
                            <p className="lg:text-base text-sm font-medium text-gray-600">
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

            {unfilled && (
              <h1 className="text-large font-bold text-red-500">
                Please fill all the required fields ( * )
              </h1>
            )}

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

  // console.log(query);

  console.log(decryptedId);

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

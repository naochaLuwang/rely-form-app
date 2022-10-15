import React, { useState, useRef } from "react";
import FormHeader from "../../components/FormHeader";
import FormFeedback from "../../models/FormFeedback";
import dbConnect from "../../utils/db";

const ViewForm = ({ data }) => {
  const [formData, setFormData] = useState(data);
  const componentRef = useRef();

  //   const handlePrint = useReactToPrint({
  //     content: () => componentRef.current,
  //     pageStyle,
  //   });

  return (
    <div>
      {/* <style type="text/css" media="print">
        @page{
          size: auto,
        }
      </style> */}
      <FormHeader />
      <div
        ref={componentRef}
        style={{ width: "100%" }}
        className="max-w-5xl bg-slate-100 rounded-md shadow-md border-t-4 mb-10 border-t-blue-500 mx-auto mt-10 py-10 px-10  "
      >
        <h1 className="text-3xl font-bold mb-10">{formData.formName}</h1>

        <div className="flex items-center justify-between pr-10 -mt-5 mb-5">
          <div className="flex flex-col">
            <h1 className="tracking-wider">
              <span className="font-semibold tracking-wider">
                Patient Name :
              </span>{" "}
              {formData.patient.salutationName}
              {formData.patient.name}
            </h1>
            <h1 className="tracking-wider">
              <span className="font-semibold">Age :</span>{" "}
              {formData.patient.ageY}
            </h1>
            <h1 className="tracking-wider">
              <span className="font-semibold">Gender :</span>{" "}
              {formData.patient.gender}
            </h1>
            <h1 className="tracking-wider">
              <span className="font-semibold">Mobile :</span>{" "}
              {formData.patient.primaryMobileNumber}
            </h1>
          </div>
          <div className="flex flex-col">
            <h1 className="tracking-wider">
              {" "}
              <span className="font-semibold">Patient Type :</span>{" "}
              {formData.patient.patientType}
            </h1>
            <h1 className="tracking-wider">
              <span className="font-semibold">IPD Number :</span>{" "}
              {formData.patient.iPDNumber}
            </h1>
            <h1 className="tracking-wider">
              <span className="font-semibold">Reg Id :</span>{" "}
              {formData.patient.regId}
            </h1>
            <h1 className="tracking-wider">
              <span className="font-semibold">UHID :</span>{" "}
              {formData.patient.uhid}
            </h1>
          </div>
        </div>

        {formData.form.map((element, i) => {
          switch (element.inputType) {
            case "text":
              return (
                <div key={i} className="flex flex-col space-y-2 mb-5 ">
                  {!formData.form[i].style.label && (
                    <h1 className="text-lg font-bold">
                      {i + 1} {"."} {formData.form[i].labelText}
                    </h1>
                  )}
                  <input
                    className="form-input w-96 border focus:border-gray-400 bg-transparent  focus:outline-0 focus:ring-0"
                    type="text"
                    value={formData.form[i].text}
                    disabled
                  />
                </div>
              );

            case "multiline":
              return (
                <div key={i} className="flex flex-col space-y-2 mb-5">
                  {!formData.form[i].style.label && (
                    <h1 className="text-lg font-bold">
                      {i + 1} {"."} {formData.form[i].labelText}
                    </h1>
                  )}

                  <textarea
                    className="w-full bg-transparent  form-textarea"
                    rows="5"
                    disabled
                    value={formData.form[i].text}
                    onChange={(e) => changeText(e.target.value, i)}
                  ></textarea>
                </div>
              );
            case "number":
              return (
                <div key={i} className="flex flex-col space-y-2 mb-5 ">
                  {!formData.form[i].style.label && (
                    <h1 className="text-lg font-bold">
                      {i + 1} {"."} {formData.form[i].labelText}
                    </h1>
                  )}
                  <input
                    className="form-input w-96 border focus:border-gray-400 bg-transparent  focus:outline-0 focus:ring-0"
                    type={formData.form[i].inputType}
                    value={formData.form[i].text}
                    disabled
                  />
                </div>
              );

            case "name":
              return (
                <div
                  key={i}
                  className=" flex items-center space-x-2 w-full mb-5"
                >
                  <h1 className="font-bold">Name :</h1>
                  <input
                    type="text"
                    className="form-input border-0 outline-0 py-0 w-96 focus:ring-0 bg-transparent "
                    value={formData.form[i].text}
                    placeholder="Enter your name"
                    disabled
                    onChange={(e) => changeText(e.target.value, i)}
                  />
                </div>
              );

            case "email":
              return (
                <div key={i} className=" flex items-center space-x-2 mb-5">
                  <h1 className="font-bold">Email :</h1>
                  <input
                    type="email"
                    className="form-input border-0 outline-0 py-0 w-96 focus:ring-0 bg-transparent "
                    value={formData.form[i].text}
                    placeholder="Enter your name"
                    disabled
                    onChange={(e) => changeText(e.target.value, i)}
                  />
                </div>
              );

            case "radio":
              return (
                <div key={i} className="flex flex-col space-y-2 mb-5">
                  <h1 className="text-lg font-bold">
                    {i + 1} {"."} {formData.form[i].text}
                  </h1>
                  {element.options.map((option, j) => {
                    return (
                      <div key={j} className="flex items-center space-x-3">
                        <input
                          type={formData.form[i].inputType}
                          value={option.optionText}
                          checked={
                            formData.form[i].ansText === option.optionText
                          }
                          disabled
                        />
                        <p>{option.optionText}</p>
                      </div>
                    );
                  })}
                </div>
              );

            case "checkbox":
              return (
                <div key={i} className="flex flex-col space-y-2 mb-5">
                  <h1>{formData.form[i].text}</h1>
                  {element.options.map((option, j) => {
                    return (
                      <div key={j} className="flex items-center space-x-3">
                        <input
                          type={formData.form[i].inputType}
                          value={option.optionText}
                          checked={option.isChecked === true}
                          disabled
                        />
                        <p>{option.optionText}</p>
                      </div>
                    );
                  })}
                </div>
              );
            case "range":
              return (
                <div key={i} className="flex  space-x-2 mb-5">
                  <h1 className="font-bold">{formData.form[i].text} :</h1>
                  <p>{formData.form[i].value}</p>
                </div>
              );

            default:
              <h1>Sorry</h1>;
          }
        })}
      </div>
    </div>
  );
};

export default ViewForm;

export async function getServerSideProps(context) {
  const { params } = context;

  const { id } = params;
  console.log(id);
  await dbConnect();
  const data = await FormFeedback.findOne({ _id: id });
  console.log(data);

  return {
    props: {
      data: JSON.parse(JSON.stringify(data)),
    },
  };
}

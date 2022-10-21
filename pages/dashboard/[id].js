import React, { useState, useRef } from "react";

import FormFeedback from "../../models/FormFeedback";
import dbConnect from "../../utils/db";

const ViewForm = ({ data }) => {
  const [formData, setFormData] = useState(data);

  return (
    <div className="max-w-screen h-auto bg-slate-100  lg:py-10 py-2 lg:px-10 px-2  lg:block">
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
                {formData.patient.name}
              </h1>
              <h1 className="tracking-wider text-sm">
                <span className="font-semibold text-sm text-gray-600 ">
                  Age :
                </span>{" "}
                {formData.patient.ageY}
              </h1>
              <h1 className="tracking-wider text-sm">
                <span className="font-semibold text-sm">Gender :</span>{" "}
                {formData.patient.gender}
              </h1>
              <h1 className="tracking-wider text-sm">
                <span className="font-semibold text-sm">Mobile :</span>{" "}
                {formData.patient.primaryMobileNumber}
              </h1>
            </div>
            <div className="flex flex-col">
              <h1 className="tracking-wider text-sm">
                {" "}
                <span className="font-semibold text-sm text-gray-600">
                  Type :
                </span>{" "}
                {formData.patient.patientType}
              </h1>
              <h1 className="tracking-wider text-sm">
                <span className="font-semibold text-sm text-gray-600">
                  IPD Number :
                </span>{" "}
                {formData.patient.iPDNumber}
              </h1>
              {/* <h1 className="tracking-wider">
                    <span className="font-semibold">Reg Id :</span>{" "}
                    {newForm?.patient.regId}
                  </h1> */}
              <h1 className="tracking-wider text-sm">
                <span className="font-semibold text-gray-600 text-sm">
                  UHID :
                </span>{" "}
                {formData.patient.uhid}
              </h1>
            </div>
          </div>
        </div>

        {formData?.form?.map((element, i) => {
          switch (element.inputType) {
            case "text":
              return (
                <div
                  key={i}
                  className="flex flex-col space-y-2 lg:mb-5 mb-2  bg-white px-10 py-4 rounded-lg shadow-sm"
                >
                  {!formData.form[i].style.label && (
                    <div className="flex ">
                      <h1 className="lg:text-base text-sm font-bold text-gray-600">
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
                    className=" text-base font-bold text-gray-700"

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
                    // onChange={(e) => changeText(e.target.value, i)}
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
                    // onChange={(e) => changeText(e.target.value, i)}
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
                    // onChange={(e) => changeText(e.target.value, i)}
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
                    // onChange={(e) => changeText(e.target.value, i)}
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
                    <h1 className="lg:text-base text-sm text-gray-700 font-semibold">
                      <span className="lg:text-base text-sm text-gray-700">
                        {i} .
                      </span>
                      {formData.form[i].text}
                    </h1>
                    {formData.form[i].required && (
                      <h1 className="text-red-500 text-xl font-bold ml-2">*</h1>
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
                            formData.form[i].ansText === option.optionText &&
                            formData.form[i].weightage === option.weightage
                          }
                          disabled
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
                    <h1 className="lg:text-base text-sm font-semibold text-gray-700">
                      <span className="lg:text-base text-sm font-semibold text-gray-700">
                        {i}
                        {". "}
                      </span>
                      {formData.form[i].text}
                    </h1>
                    {formData.form[i].required && (
                      <h1 className="text-red-500 text-xl font-bold ml-2">*</h1>
                    )}
                  </div>
                  {element.options.map((option, j) => {
                    return (
                      <div key={j} className="flex items-center space-x-3">
                        <input
                          type={formData.form[i].inputType}
                          value={option.optionText}
                          checked={
                            formData.form[i].options[j].isChecked === true
                          }
                          disabled
                        />
                        <p className="lg:text-base text-sm font-medium text-gray-600">
                          {option.optionText}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );

            // case "range":
            //   return (
            //     <div key={i} className="flex flex-col space-y-2 mb-5">
            //       <h1>{formData.form[i].text}</h1>
            //       <Slider
            //         defaultValue={0}
            //         aria-label="Default"
            //         valueLabelDisplay="auto"
            //         onChange={(e, value) => {
            //           updateRange(value, i);
            //         }}
            //       />
            //     </div>
            //   );

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

import React, { useEffect } from "react";

import FormBody from "../../components/FormBody";

import Sidebar from "../../components/Sidebar";

const Form = () => {
  return (
    <div className="flex">
      <Sidebar />
      <FormBody />
    </div>
  );
};

export default Form;

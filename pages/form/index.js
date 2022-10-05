import React, { useEffect } from "react";
import { useRouter } from "next/router";
import FormBody from "../../components/FormBody";
import FormHeader from "../../components/FormHeader";

const Form = () => {
  return (
    <>
      <FormHeader />
      <FormBody />
    </>
  );
};

export default Form;

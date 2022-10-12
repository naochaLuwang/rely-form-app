import React from "react";
import Lottie from "lottie-react";
import Head from "next/head";
import success from "../assets/success.json";
const style = {
  height: 400,
  width: 400,
};

const Success = () => {
  return (
    <>
      <Head>
        <title>Success | Rely Form</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=7" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="keywords" content="Success" />
        <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
      </Head>
      <div className="max-w-screen h-auto flex flex-col items-center justify-center ">
        <Lottie animationData={success} style={style} />
        <div className="flex flex-col items-center px-8 justify-center">
          <h1 className="text-4xl font-bold">Thank You</h1>
          <p className="text-xl font-medium mt-2 text-center">
            Your response has been saved successfully.
          </p>
        </div>
      </div>
    </>
  );
};

export default Success;

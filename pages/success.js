import React from "react";
import Lottie from "lottie-react";
import success from "../assets/success.json";
const style = {
  height: 400,
  width: 400,
};

const Success = () => {
  return (
    <div className="max-w-screen h-auto flex items-center justify-center ">
      <div className="flex flex-col items-center">
        <Lottie animationData={success} style={style} />
        <h1 className="text-4xl font-bold">Thank You</h1>
        <p className="text-xl font-medium mt-2">
          Your response has been saved successfully.
        </p>
      </div>
    </div>
  );
};

export default Success;

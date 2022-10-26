import React from "react";
import { Puff } from "react-loader-spinner";
const Loader = () => {
  return (
    <div className="w-screen h-screen flex flex-col space-y-3 items-center justify-center">
      <Puff
        height="100"
        width="100"
        radius={1}
        color="#4fa94d"
        ariaLabel="puff-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />

      <p className="text-2xl tracking-wider text-gray-500 animate-pulse duration-200 ease-in-out ">
        Submitting........
      </p>
    </div>
  );
};

export default Loader;

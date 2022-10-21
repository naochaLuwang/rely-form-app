import React from "react";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";

import Clock from "react-live-clock";

const Home = () => {
  return (
    <>
      <Head>
        <title>Form Templates | Rely Form</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="w-screen h-screen bg-gray-50 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 bg-gray-50 flex w-full h-10 space-x-2 items-center  flex-row py-10 px-10">
          <h1>Welcome , Admin</h1>
          <Clock
            className="font-medium tracking-wider"
            format={"h:mm:ssa"}
            style={{ fontSize: "14px" }}
            ticking={true}
          />
        </div>
      </div>
    </>
  );
};

export default Home;

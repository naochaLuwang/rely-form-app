import React from "react";
import Head from "next/head";
import Sidebar from "../components/Sidebar";

const Home = () => {
  return (
    <>
      <Head>
        <title>Form Templates | Rely Form</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="w-screen h-screen flex overflow-hidden">
        <Sidebar />
        <div className="flex-1">
          <h1>Home Page</h1>
        </div>
      </div>
    </>
  );
};

export default Home;

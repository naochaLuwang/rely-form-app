import React, { useState } from "react";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/router";

import { useSession, signOut } from "next-auth/react";
import FormHeader from "../components/FormHeader";

// import Clock from "react-live-clock";

const Home = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);

  const Router = useRouter();

  console.log(session?.user);

  if (status === "unauthenticated") {
    Router.push("/signin");
  }

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      {status === "authenticated" && (
        <>
          <Head>
            <title>Form Templates | Rely Form</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <div className="w-screen h-screen bg-gray-50 flex overflow-hidden">
            <Sidebar open={open} subOpen={subOpen} />
            <div className="flex-1 bg-gray-50 flex flex-col w-full h-screen space-y-5  ">
              <div className="w-full h-10">
                <FormHeader handleOpen={handleOpen} open={open} />
              </div>

              <div className="w-full px-8">
                <h1>Welcome , {session?.user.name}</h1>
                {session && <button onClick={() => signOut()}>Sign Out</button>}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;

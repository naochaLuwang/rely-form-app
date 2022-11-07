import React, { useState, useEffect } from "react";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/router";

import { getSession, useSession } from "next-auth/react";
import FormHeader from "../components/FormHeader";
import Clock from "react-live-clock";

// import Clock from "react-live-clock";

const Home = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);

  const router = useRouter();

  console.log(session?.user);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status]);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      {status === "authenticated" && (
        <>
          <Head>
            <title>Home | Rely Form</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <meta http-equiv="X-UA-Compatible" content="IE=7" />
            <meta http-equiv="X-UA-Compatible" content="ie=edge" />
            <meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
            <meta
              name="description"
              content="Rely Form , hospital feedback form"
            />
          </Head>
          <div className="w-screen h-screen bg-gray-50 flex overflow-hidden">
            <Sidebar open={open} subOpen={subOpen} />
            <div className="flex-1 bg-gray-50 flex flex-col w-full h-screen space-y-5  ">
              <div className="w-full h-10">
                <FormHeader handleOpen={handleOpen} open={open} />
              </div>

              <div className="w-full px-8 flex items-center  pt-5 space-x-2">
                <h1 className="text-gray-700">
                  Welcome , {session?.user.name}
                </h1>
                <Clock
                  format={"h:mm:ss A"}
                  ticking={true}
                  timezone={"Asia/Kolkata"}
                  noSsr={true}
                />

                {/* {session && <button onClick={() => signOut()}>Sign Out</button>} */}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(session);

  return {
    props: {
      session,
    },
  };
}

export default Home;

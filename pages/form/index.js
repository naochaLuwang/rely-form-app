import React, { useEffect } from "react";

import FormBody from "../../components/FormBody";

import Sidebar from "../../components/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Form = () => {
  const { status } = useSession();
  const router = useRouter();
  if (status === "unauthenticated") {
    router.push("/signin");
  }
  return (
    <>
      {status === "authenticated" && (
        <div className="flex ">
          <Sidebar />

          <FormBody />
        </div>
      )}
    </>
  );
};

export default Form;

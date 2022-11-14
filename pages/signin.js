import { csrfToken, signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { TailSpin } from "react-loader-spinner";
import { useSession } from "next-auth/react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

export default function SignIn() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { status } = useSession();

  const Router = useRouter();

  const signinUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    let options = { redirect: false, userId, password };
    const res = await signIn("credentials", options);
    setMessage(null);
    if (res?.error) {
      setMessage(res.error);
      toast.error(res.error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      setLoading(false);
      return;
    }
    if (res) {
      return Router.push("/");
    }
  };

  return (
    <>
      <div className="w-screen h-screen flex ">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <div className="flex-1 bg-yellow-500">
          <h1 className="text-4xl font-bold trackig-wide text-gray-700 mt-10 px-10">
            Rely Form
          </h1>
        </div>
        <div className="flex-1 w-full h-full flex flex-col items-center justify-center ">
          <div className="flex flex-col w-96 space-y-2 mb-5">
            <h1 className="text-2xl font-bold text-gray-600 ">Login</h1>
            <p className="text-xs text-gray-500">
              Enter your credentials to access your account
            </p>
          </div>
          <button className="border w-96 bg-gray-50 hover:bg-white rounded-md shadow-md">
            <div className="flex items-center justify-center py-[10px] space-x-2">
              <Image
                src="/images/googlelogo.png"
                alt="logo"
                width="20"
                height="20"
              />
              <p className="text-sm font-medium text-gray-500">
                Continue with Google
              </p>
            </div>
          </button>

          <div className="w-96 flex items-center mt-5 mb-1">
            <div className="flex-1 h-[2px] bg-gray-100"></div>
            <p className="text-lg font-medium text-gray-500 px-3">OR</p>
            <div className="flex-1 h-[2px] bg-gray-100"></div>
          </div>

          <form action="" className="flex flex-col space-y-3">
            <input type="hidden" name="csrfToken" defaultValue={csrfToken} />
            <label className="w-96 flex flex-col text-gray-600 font-medium tracking-wider ">
              User Id
              <input
                required
                className="text-input mt-2 focus:outline-none focus:bg-white  focus:ring-1 hover:border-blue-500 hover:bg-white shadow-md bg-gray-50 rounded-md border-2 border-gray-400"
                type="text"
                id="userId"
                name="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </label>
            <label className="w-96 flex flex-col font-medium text-gray-600 tracking-wider ">
              Password
              <input
                required
                className="text-input mt-2 focus:outline-none focus:bg-white  focus:ring-1 hover:border-blue-500 hover:bg-white shadow-md bg-gray-50 rounded-md border-2 border-gray-400"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button
              onClick={(e) => signinUser(e)}
              className="inline-flex items-center  justify-center px-4 py-3 text-base font-semibold leading-6 text-white whitespace-no-wrap bg-blue-600  rounded-md shadow-sm hover:bg-blue-700 focus:outline-none  "
              data-rounded="rounded-md"
              data-primary="blue-600"
              data-primary-reset="{}"
            >
              {loading ? (
                <TailSpin
                  height="20"
                  width="20"
                  color="#fff"
                  ariaLabel="tail-spin-loading"
                  radius="1"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

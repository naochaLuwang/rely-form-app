import React, { useState, useEffect } from "react";
import Head from "next/head";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/router";

import { getSession, useSession } from "next-auth/react";
import FormHeader from "../components/FormHeader";
import ReactTimeAgo from "react-time-ago";

const Notifications = () => {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);
  const [notifications, setNotifications] = useState(null);

  const router = useRouter();

  console.log(session?.user);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    const response = await fetch("/api/notification");
    const data = await response.json();
    setNotifications(data);
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      {status === "authenticated" && (
        <>
          <Head>
            <title>Notifications | Rely Form</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
            <meta httpEquiv="X-UA-Compatible" content="IE=7" />
            <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
            <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
            <meta
              name="description"
              content="Rely Form , hospital feedback form"
            />
          </Head>
          <div className="w-screen h-screen bg-gray-50 flex overflow-hidden">
            <Sidebar open={open} subOpen={subOpen} />
            <div className="flex-1 bg-gray-50 flex flex-col w-full h-screen space-y-5  ">
              <div className="w-full h-10">
                <FormHeader
                  handleOpen={handleOpen}
                  open={open}
                  title="Notifications"
                />
              </div>

              <div className="w-full  px-8  items-center  pt-5 ">
                <h1>Earlier</h1>
                <div className="w-[50rem] mt-5 h-4/5 flex flex-col space-y-2">
                  {notifications?.map((notification) => (
                    <div
                      key={notification._id}
                      className={`${
                        notification.isRead ? "bg-gray-50" : "bg-blue-50"
                      } w-full flex items-start space-x-2 px-6 py-3 border-2 rounded-md shadow-lg`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-6 h-6 text-red-600"
                      >
                        <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z" />
                        <path
                          fillRule="evenodd"
                          d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 004.496 0l.002.1a2.25 2.25 0 11-4.5 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="flex flex-col w-full ">
                        <h1 className="text-sm text-gray-600">
                          Feedback Alert
                        </h1>
                        <p className="text-xs text-gray-500">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-600 mt-2">
                          <ReactTimeAgo
                            date={notification.createdAt}
                            locale="en-Us"
                          />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

// export async function getServerSideProps(context) {
//   const session = await getSession(context);
//   console.log(session);

//   return {
//     props: {
//       session,
//     },
//   };
// }

export default Notifications;

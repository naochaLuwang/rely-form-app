import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useGlobalState } from "./FormHeader";

const NotificationCard = ({ data }) => {
  const notifications = data.slice(0, 10);
  const [read, setRead] = useState(false);
  const [message, setMessage] = useState("");

  const handleNotification = async (index) => {
    setRead(true);
    const alertMessage = notifications[index].message;
    setMessage(alertMessage);

    if (notifications.length >= 0) {
      const res = await axios.put(`/api/notification`, {
        mobileNumber: notifications[index].mobileNumber,
      });
    }
  };

  return (
    <div className="w-full max-h-auto py-2">
      <div className="flex items-center justify-between px-4">
        <h1 className="text-xs text-gray-600">Notifications</h1>
        <Link href="/notifications">
          <a className="text-xs hover:text-blue-500">View all</a>
        </Link>
      </div>

      <div className="mt-2 max-h-96 overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrokkbar-track-gray-100 scrollbar-thumb-rounded-md">
        {read ? (
          <div className="px-4 flex flex-col space-y-3 py-3 border">
            <div className="flex items-center space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
                onClick={() => setRead(false)}
              >
                <path
                  fillRule="evenodd"
                  d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
                  clipRule="evenodd"
                />
              </svg>

              <h1 className="text-sm font-medium text-gray-700">
                Feedback Alert
              </h1>
            </div>

            <p className="text-xs text-gray-500 ml-2 tracking-wide">
              {message}
            </p>
          </div>
        ) : (
          <>
            {notifications.map((noti, index) => (
              <div key={noti._id}>
                <div
                  onClick={() => handleNotification(index)}
                  className="px-4 flex items-center space-x-2  py-3 border rounded-md shadow-sm bg-blue-50 "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-10 h-10 text-red-600"
                  >
                    <path d="M5.85 3.5a.75.75 0 00-1.117-1 9.719 9.719 0 00-2.348 4.876.75.75 0 001.479.248A8.219 8.219 0 015.85 3.5zM19.267 2.5a.75.75 0 10-1.118 1 8.22 8.22 0 011.987 4.124.75.75 0 001.48-.248A9.72 9.72 0 0019.266 2.5z" />
                    <path
                      fillRule="evenodd"
                      d="M12 2.25A6.75 6.75 0 005.25 9v.75a8.217 8.217 0 01-2.119 5.52.75.75 0 00.298 1.206c1.544.57 3.16.99 4.831 1.243a3.75 3.75 0 107.48 0 24.583 24.583 0 004.83-1.244.75.75 0 00.298-1.205 8.217 8.217 0 01-2.118-5.52V9A6.75 6.75 0 0012 2.25zM9.75 18c0-.034 0-.067.002-.1a25.05 25.05 0 004.496 0l.002.1a2.25 2.25 0 11-4.5 0z"
                      clipRule="evenodd"
                    />
                  </svg>

                  <div className="flex flex-col overflow-hidden">
                    <h1 className="text-sm font-medium text-gray-700">
                      Feedback Alert
                    </h1>
                    <p className="text-xs text-gray-500 font-thin truncate">
                      {noti.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;

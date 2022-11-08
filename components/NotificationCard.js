import Link from "next/link";
import React, { useEffect } from "react";

const NotificationCard = ({ data }) => {
  const notifications = data.slice(0, 3);
  return (
    <div className="w-full h-auto py-2">
      <div className="flex items-center justify-between px-4">
        <h1 className="text-xs text-gray-600">Notifications</h1>
        <Link href="/notifications">
          <a className="text-xs hover:text-blue-500">View all</a>
        </Link>
      </div>

      {notifications.map((noti) => (
        <div
          key={noti._id}
          className="px-4 flex flex-col py-3 border rounded-md shadow-sm bg-blue-50 mt-2 "
        >
          <h1 className="text-sm font-medium text-gray-700">Feedback Alert</h1>
          <p className="text-xs text-gray-500 font-thin">{noti.message}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationCard;

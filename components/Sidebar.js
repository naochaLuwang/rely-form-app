import React, { useState } from "react";
import Image from "next/image";
import control from "../assets/images/control.png";
import logo from "../assets/images/logo.jpeg";
import Setting from "../assets/images/Setting.png";
import Chart_fill from "../assets/images/Chart_fill.png";
import Link from "next/link";
import { FcFeedback } from "react-icons/fc";
import { AiFillHome } from "react-icons/ai";
import { ChevronUpIcon } from "@heroicons/react/outline";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const Menus = [
    { title: "Home", src: Chart_fill, url: "/dashboard" },
    // {
    //   title: "Feedback",
    //   src: Setting,
    //   dropdown: [
    //     {
    //       title: "Add New Form",
    //       src: "",
    //       url: "/dash",
    //     },
    //   ],
    // },
  ];
  return (
    <div
      className={`${
        open ? "w-60" : "w-16"
      } h-screen duration-300 transalte-transform ease-in-out bg-white  pt-8 relative`}
    >
      <div
        className={`absolute cursor-pointer -right-3 w-8 h-8 z-20 top-9 border-2 rounded-full border-dark-purple ${
          !open && "rotate-180"
        }`}
        onClick={() => {
          setOpen(!open);
          setSubmenuOpen(false);
        }}
      >
        <Image src={control} alt="control" layout="fill" objectFit="contain" />
      </div>

      <div className="text-gray-600 text-sm pl-5 flex items-center gap-x-4 cursor-pointer p-2">
        <Link href="/">
          <div className="relative w-7 h-7  flex-shrink-0">
            <Image
              src={logo}
              alt="menu icons"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </Link>

        <span className={`${!open && "hidden"} font-bold text-lg `}>
          Rely Form
        </span>
      </div>

      {/* {open && (
        <div className="flex flex-col mt-5 duration-500">
          <div className="flex items-center text-white space-x-4 font-bold">
            <div className="w-12 h-12 rounded-full bg-light-white"></div>
            <div className="flex flex-col space-y-2">
              <p>Admin</p>
              <p className="font-light">admin@gmail.com</p>
            </div>
          </div>
        </div>
      )} */}

      <ul className="pt-2">
        {Menus.map((menu, index) => (
          <Link key={index} href={menu.url}>
            <div className="hover:border-l-[3px] group  border-blue-500">
              <div className="text-gray-600 group-hover:text-blue-500 font-medium text-sm pl-5 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-light-white rounded-md">
                <AiFillHome className="text-xl text-gray-600 group-hover:text-blue-500 " />

                <span className={`${!open && "hidden"} text-end`}>
                  {menu.title}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </ul>

      <ul
        className="pt-2  "
        onClick={() => {
          if (!open) {
            setOpen(true);
          }
          setSubmenuOpen(!submenuOpen);
        }}
      >
        <div
          className={`${
            submenuOpen && "border-l-4 border-blue-500"
          } hover:border-l-[3px] group  border-blue-500`}
        >
          <div
            className={`${
              submenuOpen && "text-blue-500"
            } "text-gray-600 group-hover:text-blue-500 font-medium text-sm pl-5 flex items-center gap-x-2 cursor-pointer p-2 hover:bg-light-white rounded-md`}
          >
            <FcFeedback
              className={`${
                submenuOpen && "text-blue-500"
              } text-xl text-gray-600 group-hover:text-blue-500`}
            />
            <span
              className={`${
                !open && "hidden"
              } flex items-center space w-full justify-between`}
            >
              Feedback{" "}
              <ChevronUpIcon
                className={`${
                  submenuOpen && "rotate-180 text-blue-500"
                } h-4 w-4 group-hover:text-blue-500 text-gray-600 `}
              />
            </span>
          </div>
        </div>
      </ul>

      {submenuOpen && (
        <ul
          className={`${
            !submenuOpen && "h-0"
          } h-10 duration-2000  transition-all ease-in-out`}
        >
          <div className="w-full h-fit pl-10 hover:border-l-4 border-blue-500">
            <li className="text-gray-600 hover:text-blue-500 font-medium text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md">
              <Link href="/form">Add New Form</Link>
            </li>
          </div>
          <div className="w-full h-fit pl-10 hover:border-l-4 border-blue-500">
            <li className="text-gray-600 hover:text-blue-500 font-medium text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md">
              <Link href="/formTemplate">View Form Templates</Link>
            </li>
          </div>

          <div className="w-full h-fit pl-10 hover:border-l-4 border-blue-500">
            <li className="text-gray-600 hover:text-blue-500 font-medium text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md">
              <Link href="/dashboard">View Feedbacks</Link>
            </li>
          </div>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;

import React, { useState } from "react";
import Image from "next/image";
import control from "../assets/images/control.png";
import logo from "../assets/images/logo.jpeg";
import Setting from "../assets/images/Setting.png";
import Chart_fill from "../assets/images/Chart_fill.png";
import Link from "next/link";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const Menus = [
    { title: "Dashoard", src: Chart_fill, url: "/dashboard" },
    { title: "Settings", src: Setting, url: "/" },
  ];
  return (
    <div
      className={`${
        open ? "w-60" : "w-20"
      } h-screen duration-300 transalte-transform ease-in-out bg-dark-purple p-5 pt-8 relative`}
    >
      <div
        className={`absolute cursor-pointer -right-3 w-8 h-8 top-9 border-2 rounded-full border-dark-purple ${
          !open && "rotate-180"
        }`}
        onClick={() => setOpen(!open)}
      >
        <Image src={control} alt="control" layout="fill" objectFit="contain" />
      </div>

      <div className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2">
        <Link href="/">
          <div className="relative w-7 h-7 flex-shrink-0">
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

      {open && (
        <div className="flex flex-col mt-5 duration-500">
          <div className="flex items-center text-white space-x-4 font-bold">
            <div className="w-12 h-12 rounded-full bg-light-white"></div>
            <div className="flex flex-col space-y-2">
              <p>Admin</p>
              <p className="font-light">admin@gmail.com</p>
            </div>
          </div>
        </div>
      )}

      <ul className="pt-4">
        {Menus.map((menu, index) => (
          <Link key={index} href={menu.url}>
            <li className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md">
              <div className="relative w-7 h-7 flex-shrink-0">
                <Image
                  src={menu.src}
                  alt="menu icons"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <span className={`${!open && "hidden"}`}>{menu.title}</span>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

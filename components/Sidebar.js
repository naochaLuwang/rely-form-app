import React, { useState } from "react";
import Image from "next/image";
import control from "../assets/images/control.png";
import logo from "../assets/images/logo.jpeg";
import Setting from "../assets/images/Setting.png";
import Chart_fill from "../assets/images/Chart_fill.png";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const Menus = [
    { title: "Dashoard", src: Chart_fill },
    { title: "Settings", src: Setting },
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

      <div className="flex gap-x-4 items-center ">
        <div
          className={`relative w-9 h-9 rounded-md cursor-pointer duration-500 flex-shrink-0`}
        >
          <Image src={logo} alt="logo" layout="fill" objectFit="contain" />
        </div>

        <h1
          className={`text-white origin-left font-medium text-xl duration-300 ${
            !open && "scale-0"
          }`}
        >
          Rely Form
        </h1>
      </div>

      <ul className="pt-6">
        {Menus.map((menu, index) => (
          <li
            key={index}
            className="text-gray-300 text-sm flex items-center gap-x-4 cursor-pointer p-2 hover:bg-light-white rounded-md"
          >
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
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;

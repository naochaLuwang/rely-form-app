import React from "react";
import { IconButton } from "@mui/material";
import { Menu } from "@mui/icons-material";
import { useRouter } from "next/router";

import Drawer from "@mui/material/Drawer";

const FormHeader = ({ print }) => {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const router = useRouter();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  return (
    <nav className="bg-white flex items-center w-full py-2 justify-between  shadow-md sticky top-0 z-50">
      <div className="flex items-center space-x-2">
        <div key={"left"} className="relative max-w-4xl h-10 ml-10 ">
          <IconButton onClick={toggleDrawer("left", true)}>
            <Menu />
          </IconButton>

          <Drawer
            anchor={"left"}
            open={state["left"]}
            onClose={toggleDrawer("left", false)}
          >
            <div className="w-96 h-screen py-8  flex flex-col  px-8">
              <div className="h-40"></div>
            </div>
          </Drawer>
        </div>

        <div className="flex items-end">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            onClick={() => router.push("/")}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>

          <p className="text-lg font-bold">Rely Form</p>
        </div>
      </div>

      <p className=" rounded px-6 mr-20 cursor-pointer py-2.5 overflow-hidden group bg-blue-500 relative hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-400 text-white hover:ring-2 hover:ring-offset-2 hover:ring-blue-400 transition-all ease-out duration-300">
        <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
        <span className="relative font-bold">Sign In</span>
      </p>
    </nav>
  );
};

export default FormHeader;

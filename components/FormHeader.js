import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { MenuList } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import Badge from "@mui/material/Badge";
const FormHeader = ({ handleOpen, openSidebar, title }) => {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (session) {
      const char = session.user.name.charAt(0).toUpperCase();
      setName(char);
    }
  }, [session, name]);
  return (
    <div className=" flex flex-1 px-8 py-3 items-center justify-between bg-white shadow-lg rounded-md">
      <div className="flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`${
            openSidebar
              ? "w-6 h-6 font-bold text-blue-500 cursor-pointer"
              : "w-6 h-6 font-bold text-gray-500 cursor-pointer"
          }`}
          onClick={handleOpen}
        >
          <path
            fillRule="evenodd"
            d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
            clipRule="evenodd"
          />
        </svg>
        {title && <h1 className="font-medium ml-2 text-gray-600">{title}</h1>}
      </div>

      <div className="flex items-center space-x-3">
        {title === "Form Templates" && (
          <div>
            <Link href="/form">
              <p className="rounded-md px-3.5  py-1 overflow-hidden relative group cursor-pointer border-2 font-medium border-green-600  text-white">
                <span className="absolute w-64 h-0 transition-all duration-300 origin-center rotate-45 -translate-x-20 bg-green-600 top-1/2 group-hover:h-64 group-hover:-translate-y-32 ease"></span>
                <span className="relative text-green-600 transition duration-300 group-hover:text-white ease">
                  + Create
                </span>
              </p>
            </Link>
          </div>
        )}
        <div className="h-8 w-8 border flex items-center p-1.5 justify-center rounded-lg shadow-md border-gray-300">
          <Badge badgeContent={4} color="error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-blue-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </Badge>
        </div>

        <div
          onClick={handleClick}
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          className="h-8 w-8 border flex items-center p-1.5 justify-center rounded-lg shadow-md border-gray-300 cursor-pointer"
        >
          <p className="font-medium text-blue-500 ">{name}</p>
        </div>
        <Menu
          id="basic-menu"
          className="mt-2"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuList sx={{ width: 200, maxWidth: "100%" }}>
            <MenuItem onClick={handleClose}>
              <div className="flex items-center space-x-3">
                <AccountCircleOutlinedIcon
                  fontSize="small"
                  className="text-blue-500"
                />
                <p className="font-medium text-gray-500">Profile</p>
              </div>
            </MenuItem>

            <MenuItem onClick={() => signOut()}>
              <div className="flex items-center space-x-3">
                <LogoutOutlinedIcon fontSize="small" className="text-red-700" />
                <p className="font-medium text-base text-gray-500">Logout</p>
              </div>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
};

export default FormHeader;

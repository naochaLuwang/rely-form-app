import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Avatar, Divider, ListItemIcon, MenuList } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import Badge from "@mui/material/Badge";
import { createGlobalState } from "react-hooks-global-state";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import NotificationCard from "./NotificationCard";

const initialState = { open: false, submenu: false, notifications: [] };
export const { useGlobalState } = createGlobalState(initialState);
const FormHeader = ({ title }) => {
  const [openSidebar, setOpenSidebar] = useGlobalState("open");
  const [openSubmenu, setOpenSubmenu] = useGlobalState("submenu");
  const [notificationsData, setNotificationsData] =
    useGlobalState("notifications");
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [notiOpen, setNotiOpen] = useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNclick = () => {
    setNotiOpen(!notiOpen);
  };

  const handleOpen = () => {
    if (openSidebar) {
      setOpenSubmenu(false);
    }
    setOpenSidebar(!openSidebar);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const callbackUrl = "https://rely-form.herokuapp.com";

  useEffect(() => {
    if (session) {
      const char = session.user.name.charAt(0).toUpperCase();
      setName(char);
    }
  }, [session, name]);

  useEffect(() => {
    getNotifications();
  }, []);
  const getNotifications = async () => {
    const response = await fetch("/api/notification");
    const data = await response.json();
    setNotificationsData(data);
  };

  return (
    <div className=" flex sticky top-0 z-50 flex-1 px-8 py-3 items-center justify-between bg-white shadow-lg rounded-md">
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

      <div className="flex items-center mr-5 space-x-3">
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
        <div
          onClick={handleNclick}
          className="h-8 cursor-pointer w-8 border flex items-center p-1.5 justify-center  rounded-lg shadow-md border-gray-300"
        >
          <Badge badgeContent={notificationsData.length} color="error">
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

        {notiOpen && (
          <div className="w-96 h-auto bg-white rounded-lg shadow-lg border-2 absolute top-12 right-24 z-30">
            <NotificationCard data={notificationsData} />
          </div>
        )}

        <div
          onClick={handleClick}
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          className="h-8 w-8 border  flex items-center p-1.5 justify-center rounded-lg shadow-md border-gray-300 cursor-pointer"
        >
          <p className="font-medium text-blue-500 ">{name}</p>
        </div>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              width: "15%",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem>
            <Avatar /> Profile
          </MenuItem>

          <Divider />

          <MenuItem>
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={() => signOut({ redirect: false })}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default FormHeader;

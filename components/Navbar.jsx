import React, { useEffect } from "react";

import { AiOutlineBell, AiOutlineMenu, AiOutlineSearch } from "react-icons/ai";
import { Tooltip } from "@material-ui/core";
import { MdOutlineMessage, MdOutlineChat } from "react-icons/md";

import { useStateContext } from "../contexts/ContextProvider";

const Navbar = () => {
  const {
    activeMenu,
    setActiveMenu,
    currentColor,
    screenSize,
    setScreenSize,
    searchBox,
    setSearchBox,
    user,
    chatBar,
    setChatBar,
    handleCloseChatBar,
  } = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
      setChatBar(false);
    } else {
      setActiveMenu(true);
      setChatBar(true);
    }
  }, [screenSize, setActiveMenu, setChatBar]);

  const badge =
    "bg-red-500 text-xs md:text-sm flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full text-white absolute";

  return (
    <div className="flex dark:text-gray-200 justify-between sticky top-0 w-full pt-3 pb-4 px-4 h-24 md:pt-2 nav-bar">
      <div className="flex items-center mr-2 mb-2">
        <div className="pr-3 md:pr-8">
          <Tooltip title="Menu" arrow>
            <button type="button" onClick={() => setActiveMenu(!activeMenu)}>
              <AiOutlineMenu className="text-lg md:text-xl" />
            </button>
          </Tooltip>
        </div>
        <div>
          {user && (
            <span className="text-md md:text-2xl font-semibold">
              Welcome,{" "}
              <span className="text-xs md:text-lg username italic">
                {user?.email}
              </span>{" "}
              🎉
            </span>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center md:gap-4 gap-3">
        <Tooltip title="Find Churches" arrow>
          <div
            onClick={() => setSearchBox(!searchBox)}
            className="dark:bg-light-gray bgr-white p-3 cursor-pointer drop-shadow-md hover:drop-shadow-lg rounded-full"
          >
            <span>
              <AiOutlineSearch
                style={{ color: currentColor }}
                className="text-sm md:text-lg"
              />
            </span>
          </div>
        </Tooltip>
        <Tooltip title="Chat Sidebar" arrow>
          <div
            onClick={() => setChatBar(!chatBar)}
            className="dark:bg-light-gray bgr-white p-3 cursor-pointer drop-shadow-md hover:drop-shadow-lg rounded-full"
          >
            <span>
              <MdOutlineChat
                style={{ color: currentColor }}
                className="text-sm md:text-lg"
              />
            </span>
          </div>
        </Tooltip>
        <div>
          <Tooltip title="Notifications" arrow>
            <button className="relative">
              <span
                className={`md:left-3 left-2 md:bottom-3 bottom-2 ${badge}`}
              >
                2
              </span>
              <span>
                <AiOutlineBell className="md:text-2xl text-lg" />
              </span>
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

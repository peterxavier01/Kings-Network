import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { AiOutlineLogout } from "react-icons/ai";
import { MdOutlineCancel } from "react-icons/md";
import { Tooltip } from "@material-ui/core";

import { navLinks } from "../data/data";
import { useStateContext } from "../contexts/ContextProvider";

import { auth } from "../fire";
import { signOut } from "firebase/auth";

const Sidebar = () => {
  const router = useRouter();
  const { setActiveMenu, currentColor, handleCloseSidebar } = useStateContext();
  const activeLink =
    "flex items-center p-2 rounded-lg text-white text-lg text-white mb-4";
  const normalLink =
    "flex items-center text-lg p-2 dark:text-gray-200 rounded-lg text-gray-500 mb-4 hover:bg-light-gray hover:text-gray-500 dark:hover:text-slate-800";

  const logout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="sidebar p-4 h-screen dark:bg-secondary-dark-bg">
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center border-b-1 border-gray-200 mb-4">
            <Link href="/">
              <a onClick={handleCloseSidebar} className="flex items-center">
                <span className="pr-2 w-[50px] h-[50px]">
                  <img
                    src="/favicon.ico"
                    className="w-full"
                    width={50}
                    height={50}
                    alt="kings-network-logo"
                  />
                </span>
                <span className="text-lg text-gray-500 dark:text-gray-200 pr-3">
                  King's Network
                </span>
              </a>
            </Link>
            <div>
              <Tooltip title="Close" arrow>
                <button
                  type="button"
                  onClick={() =>
                    setActiveMenu((prevActiveMenu) => !prevActiveMenu)
                  }
                  className="text-xl dark:text-gray-200 dark:hover:text-slate-800 rounded-full p-3 hover:bg-light-gray block md:hidden"
                >
                  <MdOutlineCancel />
                </button>
              </Tooltip>
            </div>
          </div>
          <div onClick={handleCloseSidebar}>
            {navLinks.map((item, index) => (
              <Link key={index} href={`/${item.link}`} passHref>
                <a
                  className={
                    router.pathname === `/${item.link}`
                      ? `${activeLink}`
                      : `${normalLink}`
                  }
                  style={
                    router.pathname === `/${item.link}`
                      ? { backgroundColor: currentColor }
                      : {}
                  }
                >
                  <span className="p-2">{item.icon}</span>
                  <p>{item.title}</p>
                </a>
              </Link>
            ))}
          </div>
        </div>
        <div className="mb-4" onClick={handleCloseSidebar}>
          <Link href="">
            <a className={normalLink} onClick={logout}>
              <span className="p-2">
                <AiOutlineLogout />
              </span>
              <p>Logout</p>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

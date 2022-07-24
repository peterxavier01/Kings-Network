import React, { useEffect } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import ThemeSettings from "../components/ThemeSettings";
import Loader from "../components/Loader";

import { useStateContext } from "../contexts/ContextProvider";

import { db, auth } from "../fire";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { Tooltip } from "@material-ui/core";
import { FiSettings } from "react-icons/fi";

import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const Layout = ({ children }) => {
  const {
    activeMenu,
    themeSettings,
    setThemeSettings,
    currentColor,
    setUser,
    currentMode,
    handleCloseSidebar,
    setCurrentColor,
    setCurrentMode,
  } = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem("colorMode");
    const currentThemeMode = localStorage.getItem("themeMode");
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, [setCurrentColor, setCurrentMode]);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  // If only the useAuthState hook is used, loader will run indefinitely
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email,
          lastSeen: serverTimestamp(),
          photoURL: user.photoURL,
        },
        { merge: true }
      );
    }
  }, [user]);

  if (loading) return <Loader />;

  return (
    <div
      className={currentMode === "Dark" ? "dark" : ""}
      onClick={handleCloseSidebar}
    >
      <div className="flex relative dark:dark-grey">
        <div className="fixed right-4 bottom-4" style={{ zIndex: "1000" }}>
          <Tooltip title="Settings" arrow>
            <button
              type="button"
              className="text-3xl p-3 hover:drop-shadow-xl hover: bg-light-gray"
              style={{
                backgroundColor: "#fff",
                color: currentColor,
                borderRadius: "50%",
              }}
              onClick={() => setThemeSettings(true)}
            >
              <FiSettings />
            </button>
          </Tooltip>
        </div>
        {activeMenu ? (
          <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
            <Sidebar />
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <Sidebar />
          </div>
        )}
        <div
          className={`dark:bg-main-dark-bg bg-main-bg min-h-screen w-full ${
            activeMenu ? "md:ml-72" : "flex-2"
          }`}
        >
          <div className="fixed md:static bgr-white dark:bg-secondary-dark-bg nav-bar w-full">
            <Navbar />
          </div>
          <div className="px-2 md:px-2">
            {themeSettings && <ThemeSettings />}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

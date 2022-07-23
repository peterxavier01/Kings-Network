import React from "react";
import {
  AiOutlineHome,
  AiOutlineUser,
  AiOutlineMessage,
  AiOutlineCalendar,
  AiOutlineBook,
} from "react-icons/ai";

export const navLinks = [
  {
    icon: <AiOutlineHome />,
    title: "Home",
    link: "",
  },

  {
    icon: <AiOutlineMessage />,
    title: "Chat",
    link: "chat",
  },
  {
    icon: <AiOutlineBook />,
    title: "Bible",
    link: "bible",
  },
  {
    icon: <AiOutlineCalendar />,
    title: "Calendar",
    link: "calendar",
  },
  {
    icon: <AiOutlineUser />,
    title: "Events",
    link: "events",
  },
];

export const themeColors = [
  {
    name: "green-theme",
    color: "#009063",
  },
  {
    name: "blue-theme",
    color: "#1A97F5",
  },
  {
    name: "purple-theme",
    color: "#7352FF",
  },
  {
    name: "red-theme",
    color: "#FF5C8E",
  },
  {
    name: "indigo-theme",
    color: "#1E4DB7",
  },
  {
    color: "#FB9678",
    name: "orange-theme",
  },
  {
    color: "#008288",
    name: "teal-theme",
  },
];

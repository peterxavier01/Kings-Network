import React from "react";
import Maps from "../components/Maps";
import privateRoute from "../components/privateRoute";

const Home = () => {
  return <Maps />;
};

export default privateRoute(Home);

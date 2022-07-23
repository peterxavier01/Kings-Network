import React from 'react'
import Image from "next/image";

import { Circle } from "better-react-spinkit";
import { useStateContext } from "../contexts/ContextProvider";

const Loader = () => {
  const { currentColor } = useStateContext();
  return (
    <div className="bg-light-gray flex flex-col items-center justify-center min-h-screen">
      <div className="mb-4 w-16 h-16 md:w-40 md:h-40 ">
        <Image src="/kings-net-logo.png" width={150} height={150} />
      </div>
      <div>
        <Circle size={40} color={currentColor} />
      </div>
    </div>
  );
};

export default Loader;

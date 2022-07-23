import moment from "moment";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../fire";

const Message = ({ user, message }) => {
  const [userLoggedIn] = useAuthState(auth);
  const messageClass = user === userLoggedIn.email ? "sender" : "receiver";

  return (
    <div className="px-4 py-2">
      <p className={`message ${messageClass} md:text-md text-sm`}>
        {message.message}
        <span className="text-gray-500 p-2 text-[9px] absolute bottom-0 text-right right-0">
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </span>
      </p>
    </div>
  );
};

export default Message;

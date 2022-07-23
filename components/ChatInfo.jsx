import React from "react";
import { useRouter } from "next/router";

import { Avatar } from "@material-ui/core";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../fire";
import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useStateContext } from "../contexts/ContextProvider";

const ChatInfo = ({ id, users }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const { handleCloseChatbar } = useStateContext();

  const recipientSnapshotQuery = query(
    collection(db, "users"),
    where("email", "==", getRecipientEmail(users, user))
  );
  const recipientSnapshot = useCollection(recipientSnapshotQuery);

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(users, user);

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <div onClick={handleCloseChatbar}>
      <div
        className="flex gap-2 p-4 items-center hover:bg-gray-200 dark:hover:text-slate-800 dark:text-gray-200 text-slate-800 cursor-pointer"
        onClick={enterChat}
      >
        <div>
          {recipient ? (
            <Avatar src={recipient?.photoURL} />
          ) : (
            <Avatar className="capitalize">{recipientEmail[0]}</Avatar>
          )}
        </div>
        <p className="font-semibold relative chat-email">
          {recipientEmail}
        </p>
      </div>
    </div>
  );
};

export default ChatInfo;

import React, { useState, useRef } from "react";
import { useRouter } from "next/router";

import { Avatar, IconButton } from "@material-ui/core";
import MoreVert from "@material-ui/icons/MoreVert";
import AttachFile from "@material-ui/icons/AttachFile";

import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../fire";
import { useCollection } from "react-firebase-hooks/firestore";
import {
  doc,
  setDoc,
  query,
  collection,
  orderBy,
  serverTimestamp,
  addDoc,
  where,
} from "firebase/firestore";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import Message from "./Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

const ChatScreen = ({ chat, messages }) => {
  const endOfMessagesRef = useRef(null);
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [input, setInput] = useState("");

  const messagesSnapRef = doc(db, "messages", router.query.id);

  const [messagesSnapshot] = useCollection(
    query(collection(messagesSnapRef, "messages"), orderBy("timestamp", "asc"))
  );

  const recipientSnapshotQuery = query(
    collection(db, "users"),
    where("email", "==", getRecipientEmail(chat.users, user))
  );

  const [recipientSnapshot] = useCollection(recipientSnapshotQuery);

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return JSON.parse(messages).map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={message}
        />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    // updates last seen status
    setDoc(
      doc(db, "users", user.uid),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );

    const ref = doc(db, "messages", router.query.id);
    addDoc(collection(ref, "messages"), {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);

  return (
    <div>
      <div className="flex sticky dark:bg-secondary-dark-bg top-[80px] md:top-0 p-4 h-[80px] flex-1 bgr-white z-[100] border-t-1 dark:border-gray-800">
        <span className="mr-4">
          {recipient ? (
            <Avatar src={recipient?.photoURL} className="capitalize" />
          ) : (
            <Avatar className="capitalize">{recipientEmail[0]}</Avatar>
          )}
        </span>
        <div className="flex-1">
          <h3 className=" text-sm md:text-lg font-bold mb-2 dark:text-gray-200">
            {recipientEmail}
          </h3>
          {recipientSnapshot ? (
            <p className="text-[9px] md:text-xs text-gray-500 dark:text-gray-200">
              Last Active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-200">
              Loading last active status...
            </p>
          )}
        </div>
        <div className="flex">
          <IconButton className="dark:text-gray-200">
            <AttachFile />
          </IconButton>
          <IconButton className="dark:text-gray-200">
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="bg-[#e5ded8] dark:bg-[hsl(0,0%,45%)] min-h-[68vh] relative">
        {showMessages()}
        <div className="absolute bottom-0" ref={endOfMessagesRef} />
      </div>

      <form className="flex items-center p-2 sticky bottom-0 bgr-white dark:bg-secondary-dark-bg z-[100]">
        <InsertEmoticonIcon className="dark:text-gray-200" />
        <input
          value={input}
          placeholder="Type Message..."
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 items-center p-2 sticky z-[100] bg-[whitesmoke] dark:bg-[#737373] mx-4 outline-none border dark:border-[#737373] dark:placeholder:text-gray-200 dark:text-gray-100"
        />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <MicIcon className="dark:text-gray-200" />
      </form>
    </div>
  );
};

export default ChatScreen;

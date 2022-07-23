import React from "react";
import { BsFillChatRightTextFill } from "react-icons/bs";
import { AiOutlineMore, AiOutlineSearch } from "react-icons/ai";
import { Avatar, IconButton } from "@material-ui/core";

import * as EmailValidator from "email-validator";
import { auth, db } from "../fire";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, addDoc, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import ChatInfo from "./ChatInfo";
import { useStateContext } from "../contexts/ContextProvider";

const ChatSidebar = () => {
  const { handleCloseChatbar } = useStateContext();
  const [user] = useAuthState(auth);

  // Reference to the list of chats
  const userChatRef = query(
    collection(db, "chats"),
    where("users", "array-contains", user?.email)
  );
  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt(
      "Please enter the email address of the user you wish to chat with"
    );
    if (!input) return null;
    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      // we need to add chat into db "Chats" collection if chat doesn't  already exist and is valid.
      addDoc(collection(db, "chats"), {
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  return (
    <div className="bgr-white dark:bg-secondary-dark-bg h-screen chat-sidebar dark:border-t-1 dark:border-slate-800">
      <div className="flex justify-between items-center p-4 sticky top-0 bgr-white dark:bg-secondary-dark-bg z-10">
        <div>
          <Avatar src={user.photoURL} />
        </div>
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-200 text-2xl">
          <IconButton className="dark:text-gray-200">
            <BsFillChatRightTextFill />
          </IconButton>
          <IconButton className="dark:text-gray-200">
            <AiOutlineMore />
          </IconButton>
        </div>
      </div>

      <div className="flex border-t-1 text-gray-500 dark:text-gray-200 p-4 items-center">
        <span className="text-2xl pr-2">
          <AiOutlineSearch />
        </span>
        <input
          type="text"
          placeholder="Search in chats"
          className="outline-none bg-transparent dark:text-gray-200 dark:placeholder:text-gray-200"
        />
      </div>

      <div
        className="border-t-1 border-b-1 p-2 flex justify-center"
        onClick={createChat}
      >
        <button className="uppercase text-gray-500 dark:text-gray-200">
          Start a new chat
        </button>
      </div>

      {/* Chat List */}
      {chatsSnapshot?.docs.map((chat) => (
        <div onClick={handleCloseChatbar}>
          <ChatInfo key={chat.id} id={chat.id} users={chat.data().users} />
        </div>
      ))}
    </div>
  );
};

export default ChatSidebar;

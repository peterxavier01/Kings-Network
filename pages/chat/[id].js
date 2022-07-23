import Head from "next/head";
import React from "react";
import ChatSidebar from "../../components/ChatSidebar";
import ChatScreen from "../../components/ChatScreen";
import { auth, db } from "../../fire";
import {
  doc,
  getDoc,
  getDocs,
  query,
  collection,
  orderBy,
} from "firebase/firestore";
import getRecipientEmail from "../../utils/getRecipientEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { useStateContext } from "../../contexts/ContextProvider";
import privateRoute from "../../components/privateRoute";

const Chat = ({ chat, messages }) => {
  const [user] = useAuthState(auth);
  const { chatBar } = useStateContext();

  return (
    <div className="flex">
      <Head>
        <title>Chat with {getRecipientEmail(chat.users, user)}</title>
      </Head>
      <div
        className={`flex-1 h-screen md:h-[86vh] overflow-scroll chat-id ${
          chatBar ? "md:mr-80" : "flex-2"
        } `}
      >
        <ChatScreen chat={chat} messages={messages} />
      </div>
      {chatBar ? (
        <div className="w-80 top-[160px] md:top-[96px] fixed right-0">
          <ChatSidebar />
        </div>
      ) : (
        <div className="w-0">
          <ChatSidebar />
        </div>
      )}
    </div>
  );
};

export default privateRoute(Chat);

export async function getServerSideProps(context) {
  const ref = doc(db, "chats", context.query.id);

  // PREP the messages on the server
  const messagesRes = await getDocs(
    query(collection(ref, "messages"), orderBy("timestamp", "asc"))
  );

  const messages = messagesRes.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .map((message) => ({
      ...message,
      timestamp: messages.timestamp.toDate().getTime(),
    }));

  // PREP the chats
  const chatRes = await getDoc(ref);
  const chat = {
    id: chatRes.id,
    ...chatRes.data(),
  };

  return {
    props: {
      messages: JSON.stringify(messages),
      chat: chat,
    },
  };
}

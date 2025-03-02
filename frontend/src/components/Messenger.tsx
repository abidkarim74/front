import { postRequest, getRequest } from "../services/apiRequests";
import ConversationBar from "./sub/ConversationsBar";
import Chats from "./sub/Chats";
import React, { useState } from "react";

const Messenger: React.FC = () => {
  const [currentChat, setCurrentChat] = useState<string | null>(null);

  return (
    <section className="messenger">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Chats</h2>
        <ConversationBar setCurrentChat={setCurrentChat} />
      </div>

      {/* Chat Area */}
      <div className="chat-window">
        {currentChat ? (
          <Chats currentChat={currentChat} />
        ) : (
          <div className="placeholder">Select a conversation to start chatting</div>
        )}
      </div>
    </section>
  );
};

export default Messenger;

import React, { useEffect, useState, useContext, useRef } from "react";
import { getRequest, postRequest } from "../../services/apiRequests";
import { AuthContext } from "../../context/authContext";
import { useSocketContext } from "../../context/socketContext";

type ChatsProps = {
  currentChat: string | null;
};

const Chats: React.FC<ChatsProps> = ({ currentChat }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [chats, setChats] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");

  const auth = useContext(AuthContext);
  if (!auth) return null;

  const { socket, onlineUsers } = useSocketContext();
  const accessToken = auth.accessToken;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentChat) return;

    const getMessages = async () => {
      try {
        const res = await getRequest(
          `/chat/conversation/${currentChat}`,
          accessToken,
          setLoading,
          setError
        );

        if (res && Array.isArray(res.messages)) {
          setChats(res.messages);
        } else {
          setChats([]);
        }
      } catch (error: any) {
        setError(error?.message || "Failed to fetch messages");
        setChats([]);
      }
    };

    getMessages();
  }, [currentChat, accessToken]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  useEffect(() => {
    if (!socket || !currentChat) return;

    const handleNewMessage = (newMessage: any) => {
      if (newMessage.conversationId === currentChat) {
        setChats((prevChats) => [...prevChats, newMessage]);
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, currentChat]);

  const sendMessage = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!message.trim()) return;

    try {
      const newMsg = await postRequest(
        { message },
        `/chat/send-message/${currentChat}`,
        accessToken,
        setLoading,
        setError
      );

      socket?.emit("sendMessage", newMsg);

      // if (newMsg.conversationId === currentChat) {
      //   setChats((prevChats) => [...prevChats, newMsg]);
      // }

      setMessage("");
    } catch (error: any) {
      setError(error?.message || "Failed to send message");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h4>Chatting</h4>
        {currentChat ? <p>Chat ID: {currentChat}</p> : <p>Select a conversation</p>}
      </div>

      <div className="online-users">
        {onlineUsers.map((user) => (
          <div key={user} className="user-item">
            <span className="user-indicator online"></span>
            {user}
          </div>
        ))}
      </div>

      <div className="messages-area">
        {loading ? (
          <p>Loading messages...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : chats.length === 0 ? (
          <p>No messages yet. Start chatting!</p>
        ) : (
          chats.map((msg, index) => (
            <div key={index} className="message">
              <p>
                <strong>{msg.sender.fullname}:</strong> {msg.message}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" disabled={loading || !message.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chats;

import React, { useEffect, useState, useContext } from "react";
import { getRequest, postRequest } from "../../services/apiRequests";
import { AuthContext } from "../../context/authContext";
import { useSocketContext } from "../../context/socketContext";
import useChatScroll from "../../hooks/useScroll";

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

  const messagesContainerRef = useChatScroll(chats);

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
      setMessage("");
    } catch (error: any) {
      setError(error?.message || "Failed to send message");
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl shadow-lg border bg-white text-gray-900 border-gray-200">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gray-100 border-gray-200 flex items-center justify-between">
        <h4 className="text-lg font-semibold">Chat</h4>
        {currentChat ? (
          <p className="text-sm">{currentChat}</p>
        ) : (
          <p className="text-sm">Select a conversation</p>
        )}
      </div>

      {/* Online Users */}
      <div className="p-3 border-b bg-gray-50 border-gray-200 flex gap-2 overflow-x-auto">
        {onlineUsers.map((user) => (
          <div
            key={user}
            className="flex items-center gap-2 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
          >
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
            {user}
          </div>
        ))}
      </div>

      {/* Messages Area */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {loading ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : chats.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet. Start chatting!</p>
        ) : (
          chats.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender.id === auth.user?.id ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-lg max-w-xs ${msg.sender.id === auth.user?.id ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-900"}`}>
                <p className="text-sm font-semibold">{msg.sender.fullname}</p>
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <form className="flex p-3 border-t bg-gray-50 border-gray-200" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring bg-white text-gray-900 border-gray-300 focus:border-blue-500"
        />
        <button type="submit" disabled={loading || !message.trim()} className="ml-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50">
          Send
        </button>
      </form>
    </div>
  );
};

export default Chats;

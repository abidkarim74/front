import React, { useEffect, useState, useContext, useCallback } from "react";
import { getRequest, postRequest } from "../../services/apiRequests";
import { AuthContext } from "../../context/authContext";
import { useSocketContext } from "../../context/socketContext";
import { v4 as uuidv4 } from "uuid";
import { FiSend, FiMoreHorizontal, FiHeart, FiSmile } from "react-icons/fi";
import { IoCheckmarkDone } from "react-icons/io5";

type ChatsProps = {
  currentChat: string | null;
};

interface User {
  id: string;
  username: string;
  profilePic: string;
  fullname: string;
}

interface Message {
  id: string;
  message: string;
  createdAt: string;
  editedAt?: string;
  sender: User;
  seen?: boolean;
}

const Chats: React.FC<ChatsProps> = ({ currentChat }) => {
  const [chats, setChats] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [otherUser, setOtherUser] = useState<User | null>(null);



  const auth = useContext(AuthContext);
  const { socket, onlineUsers } = useSocketContext();

  if (!auth) return null;
  const { accessToken, user } = auth;

  useEffect(() => {
    if (!currentChat) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const res = await getRequest(
          `/chat/conversation/${currentChat}`,
          accessToken,
          setLoading,
          setError
        );
        setChats(res?.messages || []);

        console.log("Ress: ", res);
        
        if (res?.users) {
          const other = res.users.find((participant: User) => participant.id !== user?.id);
          setOtherUser(other || null);
        }
      } catch (err: any) {
        setError(err?.message || "Failed to fetch messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentChat, accessToken, user?.id]);

  useEffect(() => {
    if (!socket || !currentChat) return;

    const handleNewMessage = (newMessage: Message) => {
      setChats((prev) => {
        const exists = prev.some((msg) => msg.id === newMessage.id);
        return exists ? prev : [...prev, newMessage];
      });
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, currentChat]);

  const sendMessage = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!message.trim()) return;

      if (!user) {
        return;
      }
      const currentDateTime = new Date().toISOString();
      
      const newMessage: Message = {
        id: uuidv4(),
        message: message,
        createdAt: currentDateTime,
        editedAt: currentDateTime,
        sender: {
          id: user?.id,
          username: user.username,
          profilePic: user.profilePic,
          fullname: user.fullname
        },
        seen: false
      };
      setChats((prevChats) => [...prevChats, newMessage]);
      setMessage("");
 
      const id = newMessage?.id;
     
      try {
        const newMsg = await postRequest(
          { message, currentDateTime, id },
          `/chat/send-message/${currentChat}`,
          accessToken,
          undefined,
          setError
        );

        socket?.emit("sendMessage", newMsg);
      } catch (err: any) {
        setError(err?.message || "Failed to send message");
      }
    },
    [message, currentChat, accessToken, socket, user]
  );

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  // Group messages by date
  const groupedMessages = chats.reduce((acc, message) => {
    const date = formatDateHeader(message.createdAt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {} as Record<string, Message[]>);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-3 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center space-x-3">
          {otherUser && (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src={otherUser.profilePic || "/default-avatar.png"} 
                  alt={otherUser.fullname} 
                  className="w-8 h-8 rounded-full object-cover"
                />
                {onlineUsers.includes(otherUser.id) && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                )}
              </div>
              <div>
                <p className="text-sm font-semibold">{otherUser.fullname}</p>
                <p className="text-xs text-gray-500">
                  {onlineUsers.includes(otherUser.id) ? "Active now" : "Offline"}
                </p>
              </div>
            </div>
          )}
        </div>
        <button className="text-gray-600">
          <FiMoreHorizontal size={20} />
        </button>
      </div>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#fafafa]">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-red-500 px-4 py-2 rounded-lg">{error}</p>
          </div>
        ) : chats.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800">No messages yet</h3>
            <p className="text-sm text-gray-500 mt-1">Send a message to start the conversation</p>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date} className="mb-4">
              <div className="flex justify-center mb-3">
                <span className="bg-white text-xs text-gray-500 px-2 py-1 rounded-full border border-gray-200">
                  {date}
                </span>
              </div>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-3 ${msg.sender.id === user?.id ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender.id !== user?.id && (
                    <div className="flex-shrink-0 mr-2 self-end">
                      <img 
                        src={msg.sender.profilePic || "/default-avatar.png"} 
                        alt={msg.sender.fullname} 
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`max-w-[70%] ${msg.sender.id === user?.id ? "flex flex-col items-end" : ""}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl ${msg.sender.id === user?.id 
                        ? "bg-[#3797F0] text-white rounded-tr-none" 
                        : "bg-gray-200 text-gray-900 rounded-tl-none"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                    <div className="flex items-center mt-1 space-x-1">
                      <span className="text-xs text-gray-400">
                        {formatTime(msg.createdAt)}
                      </span>
                      {msg.sender.id === user?.id && (
                        <IoCheckmarkDone 
                          size={16} 
                          className={msg.seen ? "text-blue-500" : "text-gray-400"} 
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-gray-200 bg-white sticky bottom-0">
        <form onSubmit={sendMessage} className="flex items-center space-x-2">
          <button type="button" className="text-gray-600">
            <FiSmile size={24} />
          </button>
          <input
            type="text"
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-2 bg-gray-100 rounded-full focus:outline-none text-sm px-4"
          />
          {message ? (
            <button
              type="submit"
              disabled={loading}
              className="text-white bg-[#3797F0] p-2 rounded-full"
            >
              <FiSend size={18} />
            </button>
          ) : (
            <button type="button" className="text-gray-600">
              <FiHeart size={24} />
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Chats;
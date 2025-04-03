import { useContext, useEffect, useState } from "react";
import { getRequest } from "../../services/apiRequests";
import { AuthContext } from "../../context/authContext";

type ConversationBarProps = {
  setCurrentChat: React.Dispatch<React.SetStateAction<string | null>>;
};

const ConversationBar: React.FC<ConversationBarProps> = ({
  setCurrentChat,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);

  const auth = useContext(AuthContext);
  if (!auth) return null;
  const accessToken = auth.accessToken;

  useEffect(() => {
    const getUserConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getRequest(
          "/chat/conversations",
          accessToken,
          setLoading,
          setError
        );
        setConversations(res?.conversations || []);
      } catch {
        setError("Failed to fetch conversations");
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      getUserConversations();
    }
  }, [accessToken]);

  return (
    <div className="w-full h-full rounded-xl shadow-lg overflow-hidden border flex flex-col bg-white border-gray-200 text-gray-800">
      <h2 className="px-4 py-3 text-lg font-semibold text-gray-800">Chats</h2>

      {/* Search Bar */}
      <div className="px-4 pb-2">
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 border rounded-full border-gray-300 bg-gray-100 focus:border-blue-500 outline-none"
        />
      </div>

      {/* Loading & Error Handling */}
      {loading && <p className="p-4 text-center text-gray-500">Loading...</p>}
      {error && <p className="p-4 text-center text-red-500">{error}</p>}
      {!loading && !error && conversations.length === 0 && (
        <p className="p-4 text-center text-gray-500">No conversations found</p>
      )}

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => {
          const otherUser = conv.users.find(
            (user: any) => user.id !== auth.user?.id
          );
          return (
            <div
              key={conv.id}
              className="flex items-center space-x-3 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-all rounded-full"

              onClick={() => setCurrentChat(conv.id)}
            >
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={otherUser?.profilePic || "/default-avatar.png"}
                alt="User Avatar"
              />

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  {otherUser?.username || "Unknown User"}
                </p>
              </div>
              {/* Online Indicator */}
              <span
                className={`w-3 h-3 rounded-full ${
                  otherUser?.isOnline ? "bg-green-500" : "bg-gray-400"
                }`}
              ></span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationBar;

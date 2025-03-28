import { useContext, useEffect, useState } from "react";
import { getRequest } from "../../services/apiRequests";
import { AuthContext } from "../../context/authContext";
import { useTheme } from "../../context/themeContext";


type ConversationBarProps = {
  setCurrentChat: React.Dispatch<React.SetStateAction<string | null>>;
};

const ConversationBar: React.FC<ConversationBarProps> = ({ setCurrentChat }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);

  const auth = useContext(AuthContext);
  const { darkMode } = useTheme(); // ✅ Use dark mode globally

  if (!auth) return null;
  const accessToken = auth.accessToken;

  useEffect(() => {
    const getUserConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getRequest("/chat/conversations", accessToken, setLoading, setError);
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
    <div
      className={`w-full h-full rounded-xl shadow-lg overflow-hidden border flex flex-col transition-all duration-300 ${
        darkMode ? "bg-gray-900 border-gray-700 text-white" : "bg-white border-gray-200 text-black"
      }`}
    >
      <h2
        className={`text-lg font-semibold p-4 border-b transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white border-gray-600" : "bg-gray-100 text-gray-700 border-gray-300"
        }`}
      >
        Chats
      </h2>

      {/* Loading & Error Handling */}
      {loading && <p className="p-4 text-center text-gray-500">Loading...</p>}
      {error && <p className="p-4 text-center text-red-500">{error}</p>}
      {!loading && !error && conversations.length === 0 && (
        <p className="p-4 text-center text-gray-500">No conversations found</p>
      )}

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conv) => {
          const otherUser = conv.users.find((user: any) => user.id !== auth.user?.id);
          return (
            <div
              key={conv.id}
              className={`flex items-center space-x-3 px-4 py-3 border-b cursor-pointer hover:transition-all ${
                darkMode
                  ? "hover:bg-gray-800 border-gray-700 text-white"
                  : "hover:bg-gray-100 border-gray-300 text-black"
              }`}
              onClick={() => setCurrentChat(conv.id)}
            >
              <img
                src={otherUser?.profilePic || "https://via.placeholder.com/40"}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover bg-gray-200"
              />
              <div>
                <p className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {otherUser?.username || "Unknown User"}
                </p>
                <p className="text-xs text-gray-500">Last message...</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationBar;

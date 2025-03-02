import { useContext, useEffect, useState } from "react";
import { getRequest } from "../../services/apiRequests";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";

type ConversationBarProps = {
  setCurrentChat: React.Dispatch<React.SetStateAction<string | null>>;
};

const ConversationBar: React.FC<ConversationBarProps> = ({ setCurrentChat }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [otherUser, setOtherUser] = useState<any | null>(null); // Store the current chat partner

  const auth = useContext(AuthContext);

  if (!auth) {
    return null;
  }

  const accessToken = auth.accessToken;

  const getUserConversations = async () => {
    try {
      const res = await getRequest("/chat/conversations", accessToken, setLoading, setError);

      if (res && Array.isArray(res.conversations)) {
        setConversations(res.conversations);
      } else {
        setConversations([]);
      }
    } catch (err) {
      setError("Failed to fetch conversations");
      setConversations([]);
    }
  };

  useEffect(() => {
    if (accessToken) {
      getUserConversations();
    }
  }, [accessToken]);

  const handleChatSelection = (conv: any) => {
    // Find the other user in the conversation
    const otherUserInConv = conv.users.find((user: any) => user.id !== auth.user?.id);
    
    if (otherUserInConv) {
      setOtherUser(otherUserInConv); // Set the other user
      setCurrentChat(conv.id); // Set the chat ID
    }
  };

  return (
    <div className="conversations">
    {loading && <p className="loading">Loading...</p>}
    {error && <p className="error">{error}</p>}
    {!loading && !error && conversations.length === 0 && <p className="no-convo">No conversations found</p>}

    {!loading &&
      !error &&
      conversations.map((conv) => {
        const otherUserInConv = conv.users.find((user:any) => user.id !== auth.user?.id);

        return (
          <div key={conv.id} className="conversation-item" onClick={() => handleChatSelection(conv)}>
            <Link to="#" className="conversation-link">
              {otherUserInConv ? otherUserInConv.username : "Unknown User"}
            </Link>
          </div>
        );
      })}

    {otherUser && (
      <div className="current-chat">
        <p>Chatting with: <span>{otherUser.username}</span></p>
      </div>
    )}
  </div>
  )
   
};

export default ConversationBar;

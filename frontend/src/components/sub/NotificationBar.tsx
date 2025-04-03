import { getRequest } from "../../services/apiRequests";
import { useState, useEffect, useContext } from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { AuthContext } from "../../context/authContext";
import { useSocketContext } from "../../context/socketContext";

interface Notification {
  id: string;
  time: string;
  message: string;
  notifier: {
    username: string;
    fullname: string;
    id: string;
    profilePic: string;
  };
}

interface NotificationBarProps {
  setUnreadCount: (count: number) => void;
}

const NotificationBar = ({ setUnreadCount }: NotificationBarProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { socket } = useSocketContext();
  const auth = useContext(AuthContext);

  if (!auth) {
    return null;
  }

  const accessToken = auth.accessToken;
  const url = "/notifications/all";

  // Calculate unread notifications count
  // const calculateUnreadCount = (notifs: Notification[]) => {
  //   return notifs.filter(notification => 
  //     new Date(notification.time) > lastReadTime
  //   ).length;
  // };

  useEffect(() => {
    const fetchNotifications = async () => {
      localStorage.removeItem('notifications');
      setUnreadCount(0);

      setLoading(true);
      setError(null);
      const response = await getRequest(url, accessToken, setLoading, setError);
      setLoading(false);

      console.log("Response: ", response);

      if (response.success) {
        setNotifications(response.notifications);
      } else {
        setError(response.error || "Failed to fetch notifications.");
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (newNotification: Notification) => {
      setNotifications((prev: Notification[]) => {
        const exists = prev.some((notif) => notif.id === newNotification.id);
        
        const updatedNotifications = exists ? prev : [newNotification, ...prev];
        
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        setUnreadCount(updatedNotifications.length);

        
        return updatedNotifications;
      });
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket]);

;

 

  return (
    <div 
      className="absolute right-4 top-full mt-2 w-[90%] sm:w-[28rem] md:w-[32rem] lg:w-[36rem] max-h-[30rem] overflow-y-auto border border-gray-300 rounded-lg shadow-2xl bg-white text-black transition-all duration-300"
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <ul className="mt-2 space-y-3">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-4 text-red-500 font-semibold">
              ⚠️ Error: {error}
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No new notifications</div>
          ) : (
            notifications.map((notification) => (
              <li
                key={notification.id}
                className={`flex items-center space-x-4 p-3 bg-white hover:bg-gray-100 transition duration-200 border-b border-gray-200 last:border-none rounded-lg shadow-sm $`}
              >
                <img
                  src={notification.notifier?.profilePic}
                  alt=""
                  className="w-12 h-12 rounded-full border border-gray-300"
                />
                <div className="flex-1">
                  <p className="text-gray-800 font-semibold">{notification.notifier.fullname}</p>
                  <p className="text-gray-600 text-sm">{notification.message}</p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(parseISO(notification.time), { addSuffix: true })}
                  </p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationBar;
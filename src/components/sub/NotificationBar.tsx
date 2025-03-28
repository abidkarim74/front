import { getRequest } from "../../services/apiRequests";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";


const NotificationBar = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const url = "/notifications/all";

  const auth = useContext(AuthContext);

  if (!auth) {
    return;
  }
  const accessToken = auth.accessToken;

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await getRequest(url, accessToken, setLoading, setError);
  
      console.log("Response: ", response);
      
      if (response.success) {
        setNotifications(response.notifications);
      }
    }
    fetchNotifications();
  }, []);

  console.log(notifications);
  
  
  return (
    <div className="absolute right-4 top-full mt-2 w-[90%] sm:w-[28rem] md:w-[32rem] lg:w-[36rem] h-[28rem] sm:h-[30rem] border border-gray-300 rounded-lg shadow-xl flex transition-all duration-300 bg-white text-black">
      <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              Notifications
            </h3>
        <ul className="mt-2 space-y-3">
          {loading ? <div>Loading notifications</div> : notifications.map((notification: any) => (
            <li className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200">
              <img src={notification.notifier.profilePic} alt="" className="w-10 h-10 rounded-full" />
              {notification.message}
            </li>
          
          ))}
           
           
          
             
            </ul>
          </div>
    </div>
  )
}

export default NotificationBar;
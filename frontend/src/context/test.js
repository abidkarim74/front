import { createContext, useContext, useState, useEffect } from "react";
import { refreshToken } from "../services/authServices.js";
import { jwtDecode } from "jwt-decode";
import { getUser } from "../services/authServices.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeUser = async () => {
      const accessToken = await refreshToken(setUser);
      if (accessToken) {
        const res = await getUser(accessToken);

        console.log("Here: ",res);

        setUser(res);
      }
    };
    initializeUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

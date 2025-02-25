import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { refreshToken, getUser } from "../services/authServices";

interface User {
  accessToken: string;
  [key: string]: any; 
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  accessToken:string | null
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<null|string>(null);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const accessToken = await refreshToken(setUser);

        if (accessToken) {
          const res = await getUser(accessToken);
          console.log("User: ",res);
          setUser(res);
          setAccessToken(accessToken);
        }
      } catch (error) {
        console.error("Error initializing user:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

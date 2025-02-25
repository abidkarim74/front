import axiosJWT from "./axiosInstance";

interface User {
  accessToken: string;
  [key: string]: any
}

export const refreshToken = async (
  setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<string | null> => {
  try {
    const res = await axiosJWT.post<{ accessToken: string }>("/auth/refresh", {}, );
    console.log("Data: ",res);
    setUser((prevUser) =>
      prevUser ? { ...prevUser, accessToken: res.data.accessToken } : null
    );
    return res.data.accessToken;
  } catch (err) {
    console.log("Refresh Token Error:", err);
    setUser(null);
    return null;
  }
};

export const loginUser = async (
  username: string,
  password: string,
  setUser: React.Dispatch<React.SetStateAction<User | null>>
): Promise<void> => {
  try {
    console.log("Here");
    const res = await axiosJWT.post<any>("/auth/login", { username, password });
    console.log("Logged user: ", res.data);

    const accessToken = res.data.accessToken;
    if (accessToken) {
      const res = await getUser(accessToken);
      console.log("User: ",res);
      setUser(res);
    }

    
  } catch (err) {
    console.log("Login Error:", err);
  }
};

export const getUser = async (accessToken: string): Promise<any> => {
  try {
    console.log("Trying: ");
    const res = await axiosJWT.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });

    console.log("THIS: ", res.data);
    return res.data;
  } catch (err) {
    console.error("Error fetching user data:", err);
  }
};

export const logoutUser = async (
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  accessToken: string | null
): Promise<void> => {
  try {
    await axiosJWT.post(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true, 
      }
    );

    setUser(null);
  } catch (err) {
    console.log("Logout Error:", err);
  }
};


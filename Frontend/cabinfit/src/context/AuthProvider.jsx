import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("accessToken") || null;
  });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        console.log("User restored from token:", res.data);
      } catch (err) {
        console.error("Failed to restore user:", err);
        setUser(null);
        setToken(null);
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  useEffect(() => {
    console.log("AUTH STATE:", { token, user, loading });
  }, [token, user, loading]);

  useEffect(() => {
    console.log("User UPDATED:", user);
  }, [user]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

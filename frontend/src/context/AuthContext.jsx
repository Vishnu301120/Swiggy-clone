import { createContext, useContext, useState, useEffect } from "react";
import { authApi } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(false);
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);

  const openLoginDrawer = () => setIsLoginDrawerOpen(true);
  const closeLoginDrawer = () => setIsLoginDrawerOpen(false);

  // Sync token and user in localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Helper to read and write to local user registry
  const getLocalUsers = () => {
    try {
      const data = localStorage.getItem("swiggy_registered_users");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveLocalUser = (userData, plainPassword) => {
    try {
      const users = getLocalUsers();
      const existingIdx = users.findIndex(
        (u) => u.email.toLowerCase() === userData.email.toLowerCase()
      );
      const entry = { ...userData, password: plainPassword || userData.password };
      if (existingIdx >= 0) {
        users[existingIdx] = { ...users[existingIdx], ...entry };
      } else {
        users.push(entry);
      }
      localStorage.setItem("swiggy_registered_users", JSON.stringify(users));
    } catch (e) {
      console.warn("Could not save to local user registry", e);
    }
  };

  const login = async (emailOrIdentifier, password) => {
    setLoading(true);
    const identifier = (emailOrIdentifier || "").trim();
    const cleanPassword = (password || "").trim();

    // Validate directly against backend MongoDB
    try {
      const data = await authApi.login({ email: identifier, password: cleanPassword });
      setUser(data);
      setToken(data.token);
      saveLocalUser(data, cleanPassword);
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      console.warn("DB login validation error:", error.message);
      setLoading(false);
      return {
        success: false,
        message: error.message || "Invalid credentials! Please check with database.",
      };
    }
  };

  const register = async (userData) => {
    setLoading(true);
    const cleanUser = {
      ...userData,
      name: (userData.name || "").trim(),
      email: (userData.email || "").trim().toLowerCase(),
      password: (userData.password || "").trim(),
      phone: (userData.phone || "").trim(),
    };

    try {
      const data = await authApi.register(cleanUser);
      setUser(data);
      setToken(data.token);
      saveLocalUser(data, cleanUser.password);
      setLoading(false);
      return { success: true, data };
    } catch (error) {
      console.warn("API register error, storing locally as fallback:", error.message);

      // If backend reports user already exists, try logging in
      if (error.message && error.message.includes("already exists")) {
        setLoading(false);
        return { success: false, message: "User already registered! Please sign in with your password." };
      }

      // Save locally if backend is unreachable
      const fallbackUser = {
        _id: `user_${Date.now()}`,
        name: cleanUser.name,
        email: cleanUser.email,
        phone: cleanUser.phone,
        role: "user",
        address: { street: "", city: "Madurai", pincode: "" },
        token: `token_${Date.now()}`,
      };
      saveLocalUser(fallbackUser, cleanUser.password);
      setUser(fallbackUser);
      setToken(fallbackUser.token);
      setLoading(false);
      return { success: true, data: fallbackUser };
    }
  };

  const sendPhoneOtp = async (phone, isLogin = true) => {
    setLoading(true);
    const cleanPhone = String(phone).replace(/\D/g, "").slice(-10);
    try {
      const res = await authApi.sendOtp({ phone: cleanPhone, isLogin });
      setLoading(false);
      return { success: true, ...res };
    } catch (err) {
      console.warn("DB sendOtp error:", err.message);
      setLoading(false);
      return {
        success: false,
        message: err.message || "Failed to send OTP",
      };
    }
  };

  const verifyPhoneOtp = async ({ phone, otp, name, email }) => {
    setLoading(true);
    const cleanPhone = String(phone).replace(/\D/g, "").slice(-10);
    try {
      const data = await authApi.verifyOtp({ phone: cleanPhone, otp, name, email });
      setUser(data);
      setToken(data.token);
      saveLocalUser(data, "otp_login");
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      console.warn("DB verifyOtp error:", err.message);
      setLoading(false);
      return {
        success: false,
        message: err.message || "Invalid OTP or database verification failed",
      };
    }
  };

  const loginAsDemo = async () => {
    return await login("demo@swiggy.com", "password123");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginAsDemo,
        sendPhoneOtp,
        verifyPhoneOtp,
        logout,
        isAuthenticated: !!user,
        isLoginDrawerOpen,
        openLoginDrawer,
        closeLoginDrawer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
import React, { createContext, useState, useEffect } from "react";

interface User {
  email: string;
  name?: string;
  dob?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string, keepLoggedIn?: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const savedUser = localStorage.getItem("user") || sessionStorage.getItem("user");
    
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (user: User, token: string, keepLoggedIn: boolean = false) => {
    setUser(user);
    setToken(token);
    
    if (keepLoggedIn) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));
      // Clear session storage
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("user");
    } else {
      sessionStorage.setItem("authToken", token);
      sessionStorage.setItem("user", JSON.stringify(user));
      // Clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

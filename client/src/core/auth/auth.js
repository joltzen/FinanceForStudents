import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    console.log(userData);
    // Further steps like storing the user data in localStorage/sessionStorage
    // for persistence across sessions can be added here
  };

  const logout = () => {
    setUser(null);
    // Also clear from localStorage/sessionStorage if used
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

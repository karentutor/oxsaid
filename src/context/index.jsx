import { createContext, useMemo, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(
    typeof window !== "undefined"
      ? {
          user: JSON.parse(localStorage.getItem("user")),
          access_token: localStorage.getItem("token"),
        }
      : {}
  );

  const value = useMemo(() => ({ auth, setAuth }), [auth, setAuth]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

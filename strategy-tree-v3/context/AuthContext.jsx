import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as auth from "../src/utils/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.getSessionUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: async (name, pass) => setUser(await auth.login(name, pass)),
      register: async (name, pass) => setUser(await auth.register(name, pass)),
      logout: async () => {
        await auth.logout();
        setUser(null);
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

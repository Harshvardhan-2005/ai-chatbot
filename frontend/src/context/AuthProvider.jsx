import { useCallback, useMemo, useState } from "react";

import { loginUser, registerUser } from "../api/authApi";
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "../utils/storage";
import AuthContext from "./authContext";

export function AuthProvider({ children }) {
  const [accessToken, setAccessTokenState] = useState(() => getAccessToken());

  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);

    setAccessToken(data.access_token);
    setAccessTokenState(data.access_token);

    return data;
  }, []);

  const register = useCallback(async (userData) => {
    return registerUser(userData);
  }, []);

  const logout = useCallback(() => {
    removeAccessToken();
    setAccessTokenState(null);
  }, []);

  const value = useMemo(
    () => ({
      accessToken,
      isAuthenticated: Boolean(accessToken),
      login,
      register,
      logout,
    }),
    [accessToken, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

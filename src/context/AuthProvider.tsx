/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "@/types/user";
import { getLocalStorage, storageConstants } from "@/utils/localStorage";
import { createContext, useContext, useState } from "react";

interface AuthContextIProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  profile: User | null;
  setProfile: React.Dispatch<React.SetStateAction<User | null>>;
  reset: () => void;
}

const AuthContext = createContext({} as AuthContextIProps);
export const useAuthContext = () => useContext(AuthContext);

export const getInitialAppContext: () => AuthContextIProps = () => ({
  isAuthenticated: Boolean(getLocalStorage(storageConstants.profile)),
  setIsAuthenticated: () => null,
  profile: getLocalStorage(storageConstants.profile),
  setProfile: () => null,
  reset: () => null,
});

const initialAppContext = getInitialAppContext();

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialAppContext.isAuthenticated,
  );
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile);

  const reset = () => {
    localStorage.removeItem(storageConstants.profile);
    setIsAuthenticated(false);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, profile, setProfile, reset }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

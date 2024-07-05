import { User } from "@/types/user";
import React from "react";

export type AuthContext = {
  isAuthenticated: boolean;
  user?: User;
  setData: (data: { isAuthenticated: boolean; user?: User }) => void;
  email_verified:boolean,
  setEmail_verified:(value:boolean)=>void
};

const authContext = React.createContext<AuthContext | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState<User | undefined>();
  const [email_verified,setEmail_verified] = React.useState(false);
  const setData = React.useCallback((data: { isAuthenticated: boolean; user?: User }) => {
    setIsAuthenticated(data.isAuthenticated);
    setUser(data.user);
  },[]);
  return (
    <authContext.Provider value={{ isAuthenticated, user, setData,email_verified,setEmail_verified }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuthContext = () => {
  const value = React.useContext(authContext);
  if (!value) {
    throw new Error("Auth Context is used outside the provider");
  }
  return value;
};

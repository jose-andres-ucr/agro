import React, { ReactNode } from "react";
import { UserContext } from "./UserContext";
import { useFetchUserData } from "../useFetchData";

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const { userAuth, userId, userData } = useFetchUserData();

  return (
    <UserContext.Provider value={{ userAuth, userId, userData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

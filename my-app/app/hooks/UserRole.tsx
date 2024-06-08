import { useEffect, useState } from "react";
import { useFetchUserData } from "./FetchData";

const useUserRole = () => {
  const {userData, userId } = useFetchUserData();
  //Get User Roll
  const [userRole, setUserRole] = useState<string | null>(null);
  useEffect(() => {
    if (userData) {
      setUserRole(userData.Role);
    } else {
      setUserRole(null);
    }
  }, [userData]);

  // Show specific role functionalities (calculators are available by default)
  const [profile, setProfile] = useState<string | null>(null);
  const [manageUsers, setManageUsers] = useState<string | null>(null);
  const [education, setEducation] = useState<string | null>(null);
  useEffect(() => {
    if (userRole == "Administrador") {
      setProfile("/profile");
      setEducation(null);
      setManageUsers("/manageUsers");
    } else if (userRole == "Docente") {
      setProfile("/profile");
      setEducation("/education");
      setManageUsers(null);
    } else if (userRole == "Estudiante") {
      setProfile("/profile");
      setEducation("/education");
      setManageUsers(null);
    } else if (userRole == "Usuario Externo") {
      setProfile("/profile");
      setEducation(null);
      setManageUsers(null);
    } else {
      // no role
      setProfile(null);
      setEducation(null);
      setManageUsers(null);
    }
  }, [userRole]);
  return { userRole, userId, profile, manageUsers, education };
};

export default useUserRole;

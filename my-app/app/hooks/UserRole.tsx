import { useEffect, useState } from "react";
import { useFetchUserData } from "./FetchData";

const useUserRole = () => {
  const { userData } = useFetchUserData();
  //Get User Roll
  const [userRole, setuserRole] = useState<string | null>(null);
  useEffect(() => {
    if (userData) {
      setuserRole(userData.Role);
    } else {
      setuserRole(null);
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
      setManageUsers("/manageUsers");
    } else if (userRole == "Estudiante") {
      setProfile("/profile");
      setEducation("/education");
      setManageUsers(null);
    } else if (userRole == "Usuario Externo") {
      setProfile("/profile");
      setEducation(null);
      setManageUsers(null);
    } else {
      // no roll
      setProfile(null);
      setEducation(null);
      setManageUsers(null);
    }
  }, [userRole]);
  return { userRole, profile, manageUsers, education };
};

export default useUserRole;

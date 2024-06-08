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
  const [manageRegister, setManageRegister] = useState<string | null>(null);
  const [manageComments, setManageComments] = useState<string | null>(null);
  const [manageEducation, setManageEducation] = useState<string | null>(null);
  const [education, setEducation] = useState<string | null>(null);
  useEffect(() => {
    if (userRole == "Administrador") {
      setProfile("true");
      setEducation("true");
      setManageRegister("true");
      setManageComments("true");
      setManageEducation("true");
    } else if (userRole == "Docente") {
      setProfile("true");
      setEducation("true");
      setManageRegister(null);
      setManageComments(null);
      setManageEducation(null);
    } else if (userRole == "Estudiante") {
      setProfile("/profile");
      setEducation("/education");
      setManageRegister(null);
      setManageComments(null);
      setManageEducation(null);
    } else if (userRole == "Usuario Externo") {
      setProfile("/profile");
      setEducation(null);
      setManageRegister(null);
      setManageComments(null);
      setManageEducation(null);
    } else {
      // no role
      setProfile(null);
      setEducation(null);
      setManageRegister(null);
      setManageComments(null);
      setManageEducation(null);
    }
  }, [userRole]);
  return { userId, userRole, profile, manageRegister, manageComments, manageEducation, education };
};

export default useUserRole;

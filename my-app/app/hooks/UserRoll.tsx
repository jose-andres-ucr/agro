import { useEffect, useState } from "react";
import useFetchUserData from "./FetchData";

const useUserRoll = () => {
  const { userData } = useFetchUserData();
  //Get User Roll
  const [userRoll, setUserRoll] = useState<string | null>(null);
  useEffect(() => {
    setUserRoll(userData?.Roll);
  }, [userData]);

  // Show specific roll functionalities (calculators are available by default)
  const [profile, setProfile] = useState<string | null>(null);
  const [manageUsers, setManageUsers] = useState<string | null>(null);
  const [education, setEducation] = useState<string | null>(null);
  useEffect(() => {
    if (userRoll == "Admin") {
      setProfile("/profile");
      setEducation(null);
      setManageUsers("/manageUsers");
    } else if (userRoll == "Professor") {
      setProfile("/profile");
      setEducation("/education");
      setManageUsers("/manageUsers");
    } else if (userRoll == "Student") {
      setProfile("/profile");
      setEducation("/education");
      setManageUsers(null);
    } else if (userRoll == "External User") {
      setProfile("/profile");
      setEducation(null);
      setManageUsers(null);
    } else {
      // no roll
      setProfile(null);
      setEducation(null);
      setManageUsers(null);
    }
  }, [userRoll]);
  return { userRoll, profile, manageUsers, education };
};

export default useUserRoll;

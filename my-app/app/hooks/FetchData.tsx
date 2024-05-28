import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import useAuthState from "./Authentication";

const useFetchUserData = () => {
  const { user } = useAuthState();
  const [userData, setUserData] =
    useState<FirebaseFirestoreTypes.DocumentData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.email) {
        //TODO: handle errors
        let response = (
          await firestore().collection("Users").doc(user.uid).get()
        ).data();
        if (response !== undefined) {
          setUserData(response);
        } else {
          setUserData(null);
        }
      }
    };

    if (user?.emailVerified) {
      fetchData();
    } else {
      setUserData(null);
    }
  }, [user]);
  let userId = user?.uid;

  return { userId, userData };
};

export default useFetchUserData;

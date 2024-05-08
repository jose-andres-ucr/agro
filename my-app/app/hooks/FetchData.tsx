import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import useAuthState from "./Authentication";

const useFetchUserData = () => {
  const { initializing, userAuthState } = useAuthState();
  const [userData, setUserData] =
    useState<FirebaseFirestoreTypes.DocumentData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (userAuthState?.email) {
        //TODO: handle errors
        let response = (
          await firestore().collection("Users").doc(userAuthState.email).get()
        ).data();
        if (response !== undefined) {
          setUserData(response);
        } else {
          setUserData(null);
        }
      }
    };

    if (userAuthState) {
      fetchData();
    } else {
      setUserData(null);
    }
  }, [userAuthState]);
  let userId = userAuthState?.email;

  return { initializing, userId, userData };
};

export default useFetchUserData;

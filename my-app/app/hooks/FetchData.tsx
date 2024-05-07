import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import useAuthState from "./Authentication";

const useFetchUserData = () => {
  const { initializing, userAuthState } = useAuthState();
  const [userData, setUserData] = useState<
    FirebaseFirestoreTypes.DocumentData | undefined
  >();

  useEffect(() => {
    const fetchData = async () => {
      if (userAuthState?.email) {
        //TODO: handle errors
        setUserData(
          (
            await firestore().collection("Users").doc(userAuthState.email).get()
          ).data()
        );
      }
    };

    if (!initializing && userAuthState) {
      fetchData();
    } else {
      setUserData(undefined);
    }
  }, [initializing, userAuthState]);
  let userId = userAuthState?.email;

  return { initializing, userId, userData };
};

export default useFetchUserData;

import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useEffect, useState } from "react";

const useAuthState = () => {
  const [initializing, setInitializing] = useState(true);
  const [userAuthState, setUserAuth] =
    useState<FirebaseAuthTypes.User | null>();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setUserAuth(user);
      if (initializing) setInitializing(false);
    });

    return () => subscriber(); // unsubscribe on unmount
  }, []);

  return { initializing, userAuthState };
};

export default useAuthState;

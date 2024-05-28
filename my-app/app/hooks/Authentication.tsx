import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { useEffect, useState } from "react";

const useAuthState = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUserAuthState] = useState<FirebaseAuthTypes.User | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUserAuthState(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe; // unsubscribe on unmount
  }, [initializing]);

  return { initializing, user };
};

export default useAuthState;

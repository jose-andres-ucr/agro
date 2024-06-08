import auth from "@react-native-firebase/auth";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import useAuthState from "./Authentication";
type User = {
  id: string;
  FirstName: string;
  LastName: string;
  SecondLastName: string | null;
  Email: string;
  Role: string;
  Approved: number;
  Verified: number;
};

export const useFetchUserData = () => {
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

  return { userAuth: user, userId: user?.uid, userData };
};

export const useFetchPendingRegistration = () => {
  const [users, setUsers] = useState<User[]>([]);

  const onResult = (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
    let data: User[] = [];

    querySnapshot.forEach((userInfo) => {
      //TODO: check if user email was verified
      if (userInfo.data().Approved === 0 && userInfo.data().Verified === 1) {
        let user: User = {
          id: userInfo.id,
          FirstName: userInfo.data().FirstName,
          LastName: userInfo.data().LastName,
          SecondLastName: userInfo.data().SecondLastName,
          Email: userInfo.data().Email,
          Role: userInfo.data().Role,
          Approved: userInfo.data().Approved,
          Verified: userInfo.data().Verified,
        };
        data.push(user);
      }
    });
    setUsers(data);
  };

  const onError = (error: Error) => {
    console.error(error);
  };

  useEffect(() => {
    firestore()
      .collection("Users")
      .orderBy("Email", "asc")
      .onSnapshot(onResult, onError);
  }, []);

  return users;
};

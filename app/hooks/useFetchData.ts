import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import useAuthState from "./useAuthentication";

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

type Group = {
  id: string;
  GroupNumber: number;
  Semester: string;
  Year: number;
  TeacherEmail: string;
  Cover: number;
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
        if (response !== undefined && response.Approved === 1) {
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

export const useFetchTeachers = () => {
  const [teachers, setTeachers] = useState<User[]>([]);

  const onResult = (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
    let data: User[] = [];

    querySnapshot.forEach((userInfo) => {
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
    });
    setTeachers(data);
  };

  const onError = (error: Error) => {
    console.error(error);
  };

  useEffect(() => {
    firestore()
      .collection("Users")
      .where("Role", "==", "Docente")
      .where("Verified", "==", 1)
      .where("Approved", "==", 1)
      .orderBy("Email", "asc")
      .onSnapshot(onResult, onError);
  }, []);

  return teachers;
};

export const useFetchGroups = (userRole: string, userEmail: string) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const onResult = (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
    let data: Group[] = [];

    querySnapshot.forEach((groupInfo) => {
      let group: Group = {
        id: groupInfo.id,
        GroupNumber: groupInfo.data().GroupNumber,
        Semester: groupInfo.data().Semester,
        Year: groupInfo.data().Year,
        TeacherEmail: groupInfo.data().TeacherEmail,
        Cover: groupInfo.data().Cover,
      };
      data.push(group);
    });
    setGroups(data);
  };

  const onError = (error: Error) => {
    console.error(error);
  };

  useEffect(() => {
    console.log(userRole, userEmail);
    if (userRole === "Administrador") {
      firestore()
        .collection("Groups")
        .orderBy("GroupNumber", "asc")
        .onSnapshot(onResult, onError);
    } else if (userRole === "Docente" && userEmail !== undefined) {
      firestore()
        .collection("Groups")
        .where("TeacherEmail", "==", userEmail)
        .orderBy("GroupNumber", "asc")
        .onSnapshot(onResult, onError);
    }
  }, []);

  return groups;
};

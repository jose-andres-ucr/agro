import { View, Text } from "react-native";
import useAuthState from "../hooks/Authentication";
import SignOut from "../components/login/SignOut";
import useFetchUserData from "../hooks/FetchData";
import { useEffect, useState } from "react";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export default function Profile() {
  const { userData } = useFetchUserData();

  return (
    <View>
      {userData ? (
        <View>
          <Text>Nombre de usuario: {userData.Name}</Text>
          <SignOut />
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}

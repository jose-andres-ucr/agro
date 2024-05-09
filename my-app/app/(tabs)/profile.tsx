import { View, Text } from "react-native";
import Logout from "../components/login/Logout";
import useFetchUserData from "../hooks/FetchData";
import { useState } from "react";
import auth from "@react-native-firebase/auth";
import Spinner from "../components/Spinner";
import { router } from "expo-router";

export default function Profile() {
  const { userId, userData } = useFetchUserData();
  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log("User signed out!");
        router.replace("/(tabs)/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <View>
      <Text>Nombre de usuario: {userData?.Name}</Text>
      <Text>Correo electrónico: {userData?.Email}</Text>
      <Text>Rol de usuario: {userData?.Role}</Text>
      <Logout handler={handleSignOut} />
    </View>
  );
}

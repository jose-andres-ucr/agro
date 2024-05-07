import { View, Text } from "react-native";
import SignOut from "../components/login/SignOut";
import useFetchUserData from "../hooks/FetchData";
import { useState } from "react";
import auth from "@react-native-firebase/auth";
import Spinner from "../components/Spinner";
import { router } from "expo-router";

export default function Profile() {
  const { userId, userData } = useFetchUserData();
  const [loading, setLoading] = useState(false);
  const handleSignOut = () => {
    setLoading(true);
    auth()
      .signOut()
      .then(() => {
        console.log("User signed out!");
        setTimeout(() => {
          setLoading(false);
          router.replace("/(tabs)/");
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      {userData && !loading ? (
        <View>
          <Text>Nombre de usuario: {userData.Name}</Text>
          <Text>Correo electrónico: {userId}</Text>
          <Text>Rol de usuario: {userData.Roll}</Text>
          <SignOut handler={handleSignOut} />
        </View>
      ) : (
        <Spinner />
      )}
    </>
  );
}

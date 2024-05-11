import { View, Text } from "react-native";
import Logout from "../components/login/Logout";
import useFetchUserData from "../hooks/FetchData";
import auth from "@react-native-firebase/auth";
import { router } from "expo-router";
import { theme } from "@/constants/theme";

export default function Profile() {
  const { userData } = useFetchUserData();
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
    <View style={theme.screenContainer}>
      <Text>Nombre de usuario: {userData?.Name}</Text>
      <Text>Correo electrónico: {userData?.Email}</Text>
      <Text>Rol de usuario: {userData?.Role}</Text>
      <Logout handler={handleSignOut} />
    </View>
  );
}

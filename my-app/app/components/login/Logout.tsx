import { Pressable, View, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import { router } from "expo-router";

export default function Logout() {
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
      <Pressable onPress={handleSignOut}>
        <Text>Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
}

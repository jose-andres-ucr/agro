import auth from "@react-native-firebase/auth";
import { router } from "expo-router";
import { Pressable, View, Text } from "react-native";

export default function SignOut() {
  const handleSignOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log("User signed out!");
        router.push("/(tabs)/");
      })
      .catch((error) => {
        console.log(error);
        router.push("/(tabs)/");
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

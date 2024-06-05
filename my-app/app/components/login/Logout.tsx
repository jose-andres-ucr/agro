import { Pressable, View, Text } from "react-native";
import auth from "@react-native-firebase/auth";

export default function Logout() {
  const handleSignOut = () => {
    auth()
      .signOut()
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

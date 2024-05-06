import { View, Text } from "react-native";
import useAuthState from "../components/login/Authentication";
import SignOut from "../components/login/SignOut";

export default function Profile() {
  let response = useAuthState();

  return (
    <View>
      <Text>Nombre de usuario: {response?.user?.email}</Text>
      <SignOut />
    </View>
  );
}

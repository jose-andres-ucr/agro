import { View, Text } from "react-native";
import Logout from "../components/login/Logout";
import { useFetchUserData } from "../hooks/FetchData";
import { theme } from "@/constants/theme";

export default function Profile() {
  const { userData } = useFetchUserData();

  return (
    <View style={theme.screenContainer}>
      <Text>
        Nombre de usuario: {userData?.FirstName} {userData?.LastName}{" "}
        {userData?.SecondLastName}
      </Text>
      <Text>Correo electrónico: {userData?.Email}</Text>
      <Text>Rol de usuario: {userData?.Role}</Text>
      <Logout />
    </View>
  );
}

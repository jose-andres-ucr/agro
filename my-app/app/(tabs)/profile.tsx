import { View, Text } from "react-native";
import { useContext } from "react";
import { UserContext } from "@/app/hooks/context/UserContext";
import Logout from "../components/login/Logout";
import { theme } from "@/constants/theme";

export default function Profile() {
  const { userData } = useContext(UserContext);

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

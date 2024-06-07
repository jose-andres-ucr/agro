import { View, Text, StyleSheet } from "react-native";
import Logout from "../components/login/Logout";
import { useFetchUserData } from "../hooks/FetchData";
import { theme } from "@/constants/theme";

export default function Profile() {
  const { userData } = useFetchUserData();

  return (
    <View style={theme.screenContainer}>
      <Text style={styles.label}>Nombre de usuario: </Text>
      <Text style={styles.text}>
        {userData?.FirstName} {userData?.LastName}{" "}{userData?.SecondLastName}
      </Text>
      <Text style={styles.label}>Correo electrónico:</Text>
      <Text style={styles.text}>{userData?.Email}</Text>
      <Text style={styles.label}>Rol de usuario: </Text>
      <Text style={styles.text}>{userData?.Role}</Text>
      <Logout />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 2,
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
});
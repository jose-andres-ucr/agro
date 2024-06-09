
import { View, Text, StyleSheet } from "react-native";
import { useContext } from "react";
import { UserContext } from "@/app/hooks/context/UserContext";
import Logout from "../components/login/Logout";
import { theme } from "@/constants/theme";
import getProfileStyles from "@/constants/styles/ProfileStyles";

export default function Profile() {
  const styles = getProfileStyles();
  const { userData } = useContext(UserContext);

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
  
});
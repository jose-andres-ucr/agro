import { StyleSheet, View, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import { Button } from "react-native-paper";
import { theme } from "@/constants/theme";

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
      <Button style={styles.button} onPress={handleSignOut}>
        <Text style={styles.text}>Cerrar Sesión</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: theme.colors.white,
    fontSize: 18,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    marginTop: 30,
    marginBottom: 10,
  },
});
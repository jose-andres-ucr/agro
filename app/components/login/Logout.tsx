import { View, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import { Button } from "react-native-paper";
import getLogoutStyles from "@/constants/styles/LogoutStyles"

export default function Logout() {
  const styles = getLogoutStyles();

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

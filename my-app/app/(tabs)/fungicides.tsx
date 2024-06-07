import { theme } from "@/constants/theme";
import { router } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export default function Fungicides() {
  return (
    <View style={theme.screenContainer}>
      <View style={styles.separator} />
      <Text style={styles.title}>Seleccione un método de calibración:</Text>
      <View style={styles.separator} />

      <Button style={styles.button}
        onPress={() =>
          router.push("../components/calculators/PesticidePerArea")
        }
      >
        <Text style={styles.buttonText}>Por Área</Text>
      </Button>
      <Button style={styles.button}
        onPress={() =>
          router.push("../components/calculators/PesticidePerPlant")
        }
      >
        <Text style={styles.buttonText}>Por Planta</Text>
      </Button>
      <View style={styles.separator} />
      <Button style={styles.button}>
        <Text style={styles.buttonText}>Ayuda</Text>
      </Button>
    </View>
  );
}


const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 25,
    height: 1,
    width: "80%",
  },
  button: {
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 18,
  },
});

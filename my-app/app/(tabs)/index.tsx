import { theme } from "@/constants/theme";
import { router } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-paper";

export default function Herbicides() {
  return (
    <View style={theme.screenContainer}>
      <View style={styles.separator} />
      <Text style={styles.title}>Seleccione un método de calibración:</Text>
      <View style={styles.separator} />

      <Button style={styles.button}
        onPress={() =>
          router.push("../components/calculators/FixedVolumeMethod")
        }
      >
        <Text style={styles.buttonText}>Volumen Fijo</Text>
      </Button>
      <Button style={styles.button}
        onPress={() =>
          router.push("../components/calculators/FixedVelocityMethod")
        }
      >
        <Text style={styles.buttonText}>Velocidad Fijo</Text>
      </Button>
      <Button style={styles.button}
        onPress={() => router.push("../components/calculators/KnownAreaMethod")}
      >
        <Text style={styles.buttonText}>
          Volumen Aplicado a un Área Conocida
        </Text>
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

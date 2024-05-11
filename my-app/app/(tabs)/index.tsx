import { theme } from "@/constants/theme";
import { router } from "expo-router";
import { StyleSheet, View, Text, Pressable } from "react-native";

export default function Herbicides() {
  return (
    <View style={theme.screenContainer}>
      <Text style={styles.title}>Seleccione un método de calibración:</Text>

      <View style={styles.separator} />

      <Pressable
        onPress={() =>
          router.push("../components/calculators/FixedVolumeMethod")
        }
      >
        <Text style={styles.title}>Método del Volumen Fijo</Text>
      </Pressable>

      <View style={styles.separator} />

      <Pressable
        onPress={() =>
          router.push("../components/calculators/FixedVelocityMethod")
        }
      >
        <Text style={styles.title}>Método de Velocidad Fijo</Text>
      </Pressable>

      <View style={styles.separator} />

      <Pressable
        onPress={() => router.push("../components/calculators/KnownAreaMethod")}
      >
        <Text style={styles.title}>
          Método del Volumen Aplicado a un Área Conocida
        </Text>
      </Pressable>

      <View style={styles.separator} />
      <View style={styles.separator} />

      <Pressable>
        <Text style={styles.title}>Ayuda</Text>
      </Pressable>

      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    width: 250,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

import { theme } from "@/constants/theme";
import { router } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function Fungicides() {
  return (
    <View style={theme.screenContainer}>
      <Text style={styles.title}>Seleccione un método de calibración:</Text>

      <View style={styles.separator} />

      <Pressable
        onPress={() =>
          router.push("../components/calculators/PesticidePerArea")
        }
      >
        <Text style={styles.title}>Por Área</Text>
      </Pressable>

      <View style={styles.separator} />

      <Pressable
        onPress={() =>
          router.push("../components/calculators/PesticidePerPlant")
        }
      >
        <Text style={styles.title}>Por Planta</Text>
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

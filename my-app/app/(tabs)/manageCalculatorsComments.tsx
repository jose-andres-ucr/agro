import { theme } from "@/constants/theme";
import { Link, router } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function ManageCalculatorsComments() {
  return (
    <View style={theme.screenContainer}>
      <Text style={styles.title}>Seleccione una calculadora para administrar sus comentarios:</Text>

      <View style={styles.separator} />
      
        <Pressable
            onPress={() =>
                router.push({ 
                    pathname: "../components/management/ManageComments", 
                    params: { collection: "PesticidePerAreaComments", calculator: "Pesticida por área" }
                })
            }
        >
          <Text style={styles.title}>Calculadora por Área</Text>
        </Pressable>
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
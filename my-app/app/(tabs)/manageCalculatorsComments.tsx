import { theme } from "@/constants/theme";
import { router } from "expo-router";
import { View, Text } from "react-native";
import getCalculatorMenuStyles from '@/constants/styles/CalculatorMenuStyles';
import { Button } from "react-native-paper";

export default function ManageCalculatorsComments() {
  const styles = getCalculatorMenuStyles();

  return (
    <View style={theme.screenContainer}>
      <View style={styles.separator} />
      <Text style={styles.title}>Seleccione una calculadora para administrar sus comentarios:</Text>
      <View style={styles.separator} />

      <Button style={styles.button}
        onPress={() =>
          router.push({ 
            pathname: "../components/management/ManageComments", 
            params: { collection: "VolumeComments", calculator: "calculadora Volumen Fijo" }
      })}>
        <Text style={styles.buttonText}>Calculadora Volumen Fijo</Text>
      </Button>
      <Button style={styles.button}
        onPress={() =>
          router.push({ 
            pathname: "../components/management/ManageComments", 
            params: { collection: "VelocityComments", calculator: "calculadora Velocidad Fija" }
      })}>
        <Text style={styles.buttonText}>Calculadora Velocidad Fija</Text>
      </Button>
      <Button style={styles.button}
        onPress={() => router.push({ 
          pathname: "../components/management/ManageComments", 
          params: { collection: "KnownAreaComments", calculator: "calculadora Volumen Aplicado a Área Conocida" }
      })}>
        <Text style={styles.buttonText}>
          Volumen Aplicado a Área Conocida
        </Text>
      </Button>
      <Button style={styles.button}
        onPress={() => router.push({ 
          pathname: "../components/management/ManageComments", 
          params: { collection: "PesticidePerAreaComments", calculator: "calculadora Pesticida por Área" }
      })}>
        <Text style={styles.buttonText}>
          Calculadora Pesticida por Área
        </Text>
      </Button>
      <Button style={styles.button}
        onPress={() => router.push({ 
          pathname: "../components/management/ManageComments", 
          params: { collection: "PesticidePerPlantComments", calculator: "calculadora Pesticida por Planta" }
      })}>
        <Text style={styles.buttonText}>
          Calculadora Pesticida por Planta
        </Text>
      </Button>
      <View style={styles.separator} />
  </View>
  );
}

import { theme } from "@/constants/theme";
import { router } from "expo-router";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import getCalculatorMenuStyles from '@/constants/styles/CalculatorMenuStyles';

export default function Herbicides() {
  const styles = getCalculatorMenuStyles();
  
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
    </View>
  );
}

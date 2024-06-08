import { theme } from "@/constants/theme";
import { router } from "expo-router";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";
import getCalculatorMenuStyles from '@/constants/styles/CalculatorMenuStyles';

export default function Fungicides() {
  const styles = getCalculatorMenuStyles();
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
    </View>
  );
}

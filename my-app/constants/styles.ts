import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useMemo } from "react";

    
const getGlobalCalculatorStyles = (theme: any) => StyleSheet.create({
    calculatorScrollView: {
        flexGrow: 1,
        backgroundColor: theme.colors.defaultBackgroundColor,
    },
    calculatorMainContainer: {
        padding: 10,
        marginTop: 10,
        backgroundColor: theme.colors.defaultBackgroundColor,
    },
});

export default function useGlobalCalculatorStyles() {
  const theme = useTheme();
  const styles = useMemo(() => getGlobalCalculatorStyles(theme), [theme]);

  return styles;
}
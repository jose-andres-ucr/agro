import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useMemo } from "react";

const getCalculatorMenuStyles = (theme: any) => StyleSheet.create({
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

export default function useCalculatorMenuStyles() {
  const theme = useTheme();
  return useMemo(() => getCalculatorMenuStyles(theme), [theme]);
}
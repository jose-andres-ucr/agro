import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useMemo } from "react";

const getSignStyles = (theme: any) => StyleSheet.create({
  text: {
    textAlign: "center",
    fontWeight: "bold",
  },
  inputField: {
    marginVertical: 10,
    width: "80%",
    textAlign: "left",
    alignSelf: "center",
  },
  error: {
    color: "red",
    alignSelf: "center",
  },
});

export default function useSignStyles() {
  const theme = useTheme();
  return useMemo(() => getSignStyles(theme), [theme]);
}
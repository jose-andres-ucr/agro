import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useMemo } from "react";

const getProfileStyles = (theme: any) => StyleSheet.create({
  label: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 2,
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
});

export default function useProfileStyles() {
  const theme = useTheme();
  return useMemo(() => getProfileStyles(theme), [theme]);
}
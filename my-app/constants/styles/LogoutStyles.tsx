import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useMemo } from "react";

const getLogoutStyles = (theme: any) => StyleSheet.create({
  text: {
    color: theme.colors.white,
    fontSize: 18,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    marginTop: 30,
    marginBottom: 10,
  },
});

export default function useLogoutStyles() {
  const theme = useTheme();
  return useMemo(() => getLogoutStyles(theme), [theme]);
}
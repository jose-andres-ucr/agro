import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useMemo } from "react";

const getDrawerStyles = (theme: any) => StyleSheet.create({
  image: {
    width: 175, 
    height: 75, 
    alignSelf: "center", 
    marginVertical: 20
  },
});

export default function useDrawerStyles() {
  const theme = useTheme();
  return useMemo(() => getDrawerStyles(theme), [theme]);
}
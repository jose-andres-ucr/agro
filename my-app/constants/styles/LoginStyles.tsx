import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useMemo } from "react";

const getLoginStyles = (theme: any) => StyleSheet.create({
  text: {
    textAlign: "center",
    fontWeight: "bold",
  },
  inputField: {
    marginVertical: 4,
    width: "60%",
    textAlign: "left",
    alignSelf: "center",
  },
  button: {
    alignSelf: "center",
    marginTop: 20,
  },
  error: {
    color: "red",
    alignSelf: "center",
  },
  logo: {
    width: '100%', 
    height: 50,
    marginBottom: 30,
  },
  bottomText: {
    marginTop: 30, 
    marginBottom: 40,
    alignItems: "center",
  }
});

export default function useLoginStyles() {
  const theme = useTheme();
  return useMemo(() => getLoginStyles(theme), [theme]);
}
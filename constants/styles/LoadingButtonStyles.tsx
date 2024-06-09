import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useMemo } from "react";

const getLoadingButtonStyles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
      },
      horizontal: {
        flexDirection: "row",
        justifyContent: "space-around",
      },
      button: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 15,
        paddingRight: 20,
        width: "auto",
        height: "auto",
      },
});

export default function useLoadingButtonStyles() {
  const theme = useTheme();
  return useMemo(() => getLoadingButtonStyles(theme), [theme]);
}
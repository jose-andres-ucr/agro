import { ViewStyle } from "react-native";
import { MD2LightTheme } from "react-native-paper";

export const theme = {
  ...MD2LightTheme,
  screenContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignContent: "center",
    padding: 28,
    backgroundColor: "#FFF",
  } as ViewStyle,
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    padding: 28,
    backgroundColor: "#FFF",
  } as ViewStyle,
  colors: {
    ...MD2LightTheme.colors,
    primary: "#00c0f3",
    secondary: "#008641",
    complementaryGreen: "#DD8641",
  },
};

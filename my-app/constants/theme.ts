import { ViewStyle } from "react-native";
import { MD3LightTheme } from "react-native-paper";

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#00c0f3",
    secondary: "#008641",
    defaultBackgroundColor: "#FFFFFF",
    inputBackgroundColor: "#6dc067",
    inputBorderColor: "#7C757E",
    inputColor: "black"
  }, 
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
};

import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useMemo } from "react";

    
const getGlobalCalculatorStyles = (theme: any) => StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        backgroundColor: theme.colors.defaultBackgroundColor,
    },
    mainContainer: {
        padding: 10,
        marginTop: 10,
        backgroundColor: theme.colors.defaultBackgroundColor,
    },
    header: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 20,
      },
    body: {
        textAlign: "justify",    
        fontSize: 16,
    },
    text: {    
        fontWeight: "bold",
        alignSelf: "center",
        marginLeft: 10
    },
    formContainer: {
        marginTop: 20,
        marginBottom: 20,
    },  
    inputField: {
        width: "70%",
        marginTop: 5
    },
    inputGroup: {
        flexDirection: "row"
    },
    button: {
        alignSelf: "flex-end",
    },
    resultGroup: {
        justifyContent: "flex-end",
        alignItems: "center",
        padding: 8,
        flexDirection: "row",
    },
    resultField: {
        width: "50%",
        textAlign: "center",
    },
});

export default function useGlobalCalculatorStyles() {
  const theme = useTheme();
  const styles = useMemo(() => getGlobalCalculatorStyles(theme), [theme]);

  return styles;
}
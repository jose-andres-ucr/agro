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
        marginVertical: 20,
    },  
    inputGroup: {
        marginVertical: 5,
        flexDirection: "row",
    },
    inputField: {        
        marginTop: -5,
        width: "70%",
    },
    button: {
        alignSelf: "flex-end",
    },
    multiUnitButton: {        
        justifyContent: "center",
        alignItems: "flex-start",                
        borderColor: theme.colors.inputBorderColor,
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: theme.colors.inputBackgroundColor,
        width: "30%",
    },
    multiUnitButtonText: {
        fontSize: 16,
        fontWeight: "bold",        
        color: theme.colors.inputColor,        
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
  return useMemo(() => getGlobalCalculatorStyles(theme), [theme]);
}
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
        alignSelf: "flex-start",
        borderRadius: 5,
    },    
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",  
    },
    resultGroup: {
        marginVertical: 5,                      
        flexDirection: "row",
    },
    resultField: {       
        width: "70%",
    },
});

export default function useGlobalCalculatorStyles() {
  const theme = useTheme();
  return useMemo(() => getGlobalCalculatorStyles(theme), [theme]);
}
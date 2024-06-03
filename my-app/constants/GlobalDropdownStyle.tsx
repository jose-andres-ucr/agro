import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useMemo } from "react";


const getGlobalDropdownStyles = (theme: any) => StyleSheet.create({
    dropdown: {                
        borderWidth: 1,
        borderRadius: 5,
        borderColor: theme.colors.inputBorderColor,        
        backgroundColor: theme.colors.inputBackgroundColor,
        width: "30%",                              
    },
    focusedDropdown: {
        borderColor: theme.colors.primary,
        borderWidth: 1,
        borderRadius: 5,        
        backgroundColor: theme.colors.defaultBackgroundColor,
        width: "30%",        
    },
    placeholderStyle: {
        fontSize: 8,        
    },
    selectedTextStyle: {
        fontSize: 16,
        fontWeight: "bold",        
        color: theme.colors.inputColor,
        marginLeft: 20
        
    },
});

export default function useGlobalDropdownStyles() {
    const theme = useTheme();
    return useMemo(() => getGlobalDropdownStyles(theme), [theme]);
}
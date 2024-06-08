import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useMemo } from "react";


const getGlobalDropdownStyles = (theme: any) => StyleSheet.create({
    unfocusedDropdown: {                
        borderWidth: 1,
        borderRadius: 5,
        borderColor: theme.colors.inputBorderColor,        
        backgroundColor: theme.colors.inputBackgroundColor,
        width: "30%",                              
    },
    focusedDropdown: {
        borderColor: theme.colors.inputBackgroundColor,
        borderWidth: 1,
        borderRadius: 5,        
        backgroundColor: theme.colors.inputBackgroundColor,
        width: "30%",        
    },
    dropdownItem: {
        backgroundColor: theme.colors.defaultBackgroundColor,
        borderColor: "black",
        borderRadius: 5,
        borderWidth: 1
    },
    selectedStyle: {
        backgroundColor: theme.colors.defaultBackgroundColor,
    },
    selectedTextStyle: {
        fontSize: 16,
        fontWeight: "bold",        
        color: theme.colors.inputColor,
        marginLeft: 20        
    },
    itemTextStyle: {
        fontSize: 16,
        fontWeight: "bold",
        color: theme.colors.inputColor,
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
    dropDownRowContainer: {
        justifyContent: "center",
        alignItems: "flex-start",
        flexDirection: "row",        
    },
    modalContainer: {                
        backgroundColor: theme.colors.defaultBackgroundColor,
        padding: 10,
    },
    text: {    
        fontSize: 24,
        fontWeight: "bold",
        alignSelf: "center",
        marginHorizontal: 5
    }
});

export default function useGlobalDropdownStyles() {
    const theme = useTheme();
    return useMemo(() => getGlobalDropdownStyles(theme), [theme]);
}
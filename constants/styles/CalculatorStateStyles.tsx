import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useMemo } from "react";

const getCalculatorStateStyles = (theme: any) => StyleSheet.create({
  modalContainer: {
    backgroundColor: theme.colors.defaultBackgroundColor,
    margin: 20,        
  },
  loadContainer: {
    backgroundColor: theme.colors.defaultBackgroundColor,
    margin: 20,        
  },
  saveContrainer: {
    backgroundColor: theme.colors.defaultBackgroundColor,
    margin: 20,        
  },
  topContainer: {        
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
  },
  button: {
    alignSelf: "flex-start",
    borderRadius: 5,
  },
  buttonCenter: {
    alignSelf: "center",
    borderRadius: 5,
  },    
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",  
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",  
  },
  unfocusedDropdown: {                
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.colors.inputBorderColor,        
    backgroundColor: theme.colors.inputBackgroundColor,
    marginVertical: 10,                                     
  },
  focusedDropdown: {
    borderColor: theme.colors.inputBackgroundColor,
    borderWidth: 1,
    borderRadius: 5,        
    backgroundColor: theme.colors.inputBackgroundColor,        
    marginVertical: 10,
  },
  dropdownItem: {
    backgroundColor: theme.colors.defaultBackgroundColor,
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 1
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
});

export default function useCalculatorStateStyles() {
  const theme = useTheme();
  return useMemo(() => getCalculatorStateStyles(theme), [theme]);
}
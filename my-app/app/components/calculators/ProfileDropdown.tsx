import useGlobalDropdownStyles from "@/constants/GlobalDropdownStyle";
import { DropdownItem } from "@/constants/units";
import { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";

export const ProfileDropdown = (props: { data: DropdownItem[] }) => {
    const styles = useGlobalDropdownStyles();

    const [loadProfileFocus, setLoadProfileFocus] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<string | null>(null);

    const handleLoadProfileChange = (item: DropdownItem) => {
        setSelectedProfile(item.value);
    }
    
    return (
        <Dropdown
            style={loadProfileFocus ? styles.focusedDropdown : styles.unfocusedDropdown}  
            containerStyle={styles.dropdownItem}                      
            selectedTextStyle={styles.selectedTextStyle}
            activeColor={styles.unfocusedDropdown.backgroundColor}
            itemTextStyle={styles.itemTextStyle}
            data={props.data}
            mode="default"
            maxHeight={300}
            labelField={"label"}
            valueField={"value"}
            placeholder={selectedProfile || ''}
            value={"Profile 2"}
            onFocus={() => setLoadProfileFocus(true)}
            onBlur={() => setLoadProfileFocus(false)}
            onChange={handleLoadProfileChange}
        /> 
    )
}
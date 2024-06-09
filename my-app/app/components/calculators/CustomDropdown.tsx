import useGlobalDropdownStyles from '@/constants/styles/GlobalDropdownStyle';
import { DropdownItem } from '@/constants/units';
import React, {  useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';


export const CustomDropdown = (props: { data: DropdownItem[], isModal: boolean, value: string | null, onValueChange: (value: string) => void, unfocusedStyle?: any, focusedStyle?: any}) => {

    const styles = useGlobalDropdownStyles();    
    const [isFocus, setIsFocus] = useState(false);

    const focusedStyle = props.focusedStyle || styles.focusedDropdown;
    const unfocusedStyle = props.unfocusedStyle || styles.unfocusedDropdown;

    const onChange = (item: DropdownItem) => {        
        setIsFocus(false);
        props.onValueChange(item.value);
    }

    return (
        <Dropdown
            style={isFocus ? focusedStyle : unfocusedStyle}  
            containerStyle={styles.dropdownItem}                      
            selectedTextStyle={styles.selectedTextStyle}
            activeColor={styles.unfocusedDropdown.backgroundColor}
            itemTextStyle={styles.itemTextStyle}
            data={props.data}
            mode={props.isModal ? 'modal' : 'default'}
            maxHeight={300}            
            labelField="value"
            valueField="value"
            placeholder={props.value || ''}
            value={props.value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={onChange}
        />
    );
};
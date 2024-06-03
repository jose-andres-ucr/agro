import useGlobalDropdownStyles from '@/constants/GlobalDropdownStyle';
import React, { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { Unit } from '@/constants/units';


export const DropdownComponent = (props: { data: Unit[], isModal: boolean, value: string | null, onValueChange: (value: string) => void }) => {
    const styles = useGlobalDropdownStyles();
    const [value, setValue] = useState<string | null>(props.value);
    const [isFocus, setIsFocus] = useState(false);

    const onChange = (item: Unit) => {
        setValue(item.value);
        setIsFocus(false);
        props.onValueChange(item.value);
    }

    return (
        <Dropdown
            style={isFocus ? styles.focusedDropdown : styles.dropdown}  
            containerStyle={styles.dropdownItem}                      
            selectedTextStyle={styles.selectedTextStyle}
            activeColor={styles.dropdown.backgroundColor}
            itemTextStyle={styles.itemTextStyle}
            data={props.data}
            mode={props.isModal ? 'modal' : 'default'}
            maxHeight={300}            
            labelField="value"
            valueField="value"
            placeholder={value || ''}
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={onChange}
        />
    );
};
import useGlobalDropdownStyles from '@/constants/GlobalDropdownStyle';
import React, { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { Unit } from '@/constants/units';

export const DropdownComponent = (props: { data: Unit[] }) => {
    const styles = useGlobalDropdownStyles();
    const [value, setValue] = useState<string | null>(props?.data[0].value);
    const [isFocus, setIsFocus] = useState(false);

    return (
        <Dropdown
            style={isFocus ? styles.focusedDropdown : styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            
            selectedTextStyle={styles.selectedTextStyle}
            data={props.data}
            mode="modal"           
            maxHeight={300}
            labelField="value"
            valueField="value"
            placeholder={value || ''}
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
            setValue(item.value);
            setIsFocus(false);
            }}
        />
    );
};
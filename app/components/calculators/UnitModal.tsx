import useGlobalDropdownStyles from '@/constants/styles/GlobalDropdownStyle';
import { useState } from 'react';
import { Modal, Portal, Text, Button } from 'react-native-paper';
import { CustomDropdown } from './CustomDropdown';
import { Unit } from '@/constants/units';
import { View } from 'react-native';


export const UnitModal = (props: {leftUnits: Unit[], rightUnits: Unit[], leftValue: string, rightValue: string, onLeftUnitChange: (value: string) => void, onRightUnitChange: (value: string) => void}) => {
    const styles = useGlobalDropdownStyles();
    const [visible, setVisible] = useState(false);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const handleLeftUnitChange = (value: string) => {        
        props.onLeftUnitChange(value);
    }

    const handleRightUnitChange = (value: string) => {       
        props.onRightUnitChange(value);
    }

    return (
        <>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>                    
                    <View style={styles.dropDownRowContainer}>
                        <CustomDropdown
                        data={props.leftUnits}
                        isModal={false}
                        value={props.leftValue}
                        onValueChange={handleLeftUnitChange}>              
                        </CustomDropdown>
                        <Text style={styles.text}>/</Text>
                        <CustomDropdown
                        data={props.rightUnits}
                        isModal={false}
                        value={props.rightValue}
                        onValueChange={handleRightUnitChange}>              
                        </CustomDropdown>
                    </View>
                </Modal>
            </Portal>
            <Button 
            mode="contained"
            style={styles.multiUnitButton}
            labelStyle={styles.multiUnitButtonText}
            onPress={showModal}>
            {props.leftValue + '/' + props.rightValue}
            </Button>
        </>
    );
};
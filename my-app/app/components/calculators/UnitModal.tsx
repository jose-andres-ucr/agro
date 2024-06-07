import useGlobalDropdownStyles from '@/constants/styles/GlobalDropdownStyle';
import { useState } from 'react';
import { Modal, Portal, Text, Button } from 'react-native-paper';
import { DropdownComponent } from './UnitDropdown';
import { Unit } from '@/constants/units';
import { View } from 'react-native';


export const UnitModal = (props: {leftUnits: Unit[], rightUnits: Unit[], leftValue: string, rightValue: string, onLeftUnitChange: (value: string) => void, onRightUnitChange: (value: string) => void}) => {
    const styles = useGlobalDropdownStyles();
    const [visible, setVisible] = useState(false);

    const [leftUnitValue, setLeftUnitValue] = useState<string>(props.leftValue);
    const [rightUnitValue, setRightUnitValue] = useState<string>(props.rightValue);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const handleLeftUnitChange = (value: string) => {
        setLeftUnitValue(value);
        props.onLeftUnitChange(value);
    }

    const handleRightUnitChange = (value: string) => {
        setRightUnitValue(value);
        props.onRightUnitChange(value);
    }

    return (
        <>
            <Portal>
                <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>                    
                    <View style={styles.dropDownRowContainer}>
                        <DropdownComponent
                        data={props.leftUnits}
                        isModal={false}
                        value={leftUnitValue}
                        onValueChange={handleLeftUnitChange}>              
                        </DropdownComponent>
                        <Text style={styles.text}>/</Text>
                        <DropdownComponent
                        data={props.rightUnits}
                        isModal={false}
                        value={rightUnitValue}
                        onValueChange={handleRightUnitChange}>              
                        </DropdownComponent>
                    </View>
                </Modal>
            </Portal>
            <Button 
            mode="contained"
            style={styles.multiUnitButton}
            labelStyle={styles.multiUnitButtonText}
            onPress={showModal}>
            {leftUnitValue + '/' + rightUnitValue}
            </Button>
        </>
    );
};
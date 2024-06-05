import { useState } from 'react';
import { Modal, Portal, Button, Text} from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { CustomDropdown } from './CustomDropdown';
import { theme } from '@/constants/theme';
import { DropdownItem } from '@/constants/units';

const profiles = [
    "Profile 1",
    "Profile 2",
    "Profile 3",
    "Profile 4",
    "Profile 5",
]

function convertListToDropdown(arr: string[]): DropdownItem[] {
    return arr.map(str => ({ label: str, value: str }));
  }

export const CalculatorStateManager = (props: {profiles: string[]}) => {
    const [loadModalVisible, setLoadModalVisible] = useState(false);
    const [saveModalVisible, setSaveModalVisible] = useState(false);

    const handleValueChange = (value: string) => {
        console.log(value);
    }

    const profiles = convertListToDropdown(props.profiles);

    const showLoadModal = () => setLoadModalVisible(true);
    const hideLoadModal = () => setLoadModalVisible(false);

    const showSaveModal = () => setSaveModalVisible(true);
    const hideSaveModal = () => setSaveModalVisible(false);

    return (
        <>
            <Portal>
                <Modal visible={saveModalVisible} onDismiss={hideSaveModal} contentContainerStyle={styles.modalContainer}>                    
                    <View style={styles.saveContrainer}>
                        <CustomDropdown
                        data={profiles}
                        isModal={false}
                        value={profiles[0].value}
                        onValueChange={handleValueChange}
                        unfocusedStyle={styles.unfocusedDropdown}
                        focusedStyle={styles.focusedDropdown}>                        
                        </CustomDropdown>
                    </View>
                </Modal>
            </Portal>
            <Portal>
                <Modal visible={loadModalVisible} onDismiss={hideLoadModal} contentContainerStyle={styles.modalContainer}>                    
                    <View style={styles.loadContainer}>
                        <Text style={styles.text}>Perfil:</Text>
                        <CustomDropdown
                        data={profiles}
                        isModal={false}
                        value={profiles[0].value}
                        onValueChange={handleValueChange}
                        unfocusedStyle={styles.unfocusedDropdown}
                        focusedStyle={styles.focusedDropdown}>                        
                        </CustomDropdown>
                        <Text style={styles.text}>Cálculo:</Text>
                        <CustomDropdown
                        data={profiles}
                        isModal={false}
                        value={profiles[0].value}
                        onValueChange={handleValueChange}
                        unfocusedStyle={styles.unfocusedDropdown}
                        focusedStyle={styles.focusedDropdown}>                        
                        </CustomDropdown>
                    </View>                   
                </Modal>
            </Portal>
            
            <View style={styles.topContainer}>                
                <Button
                mode="contained"
                style={styles.button}
                labelStyle={styles.buttonText}
                onPress={showSaveModal}
                >
                Guardar
                </Button>
                <Text style={styles.text}>Nuevo cálculo</Text>
                <Button 
                mode="contained"
                style={styles.button}
                labelStyle={styles.buttonText}
                onPress={showLoadModal}>
                Abrir
                </Button>
            </View>
                
        </>
    );
};


const styles = StyleSheet.create({
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
});
import { useEffect, useState } from 'react';
import { Modal, Portal, Button, Text} from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { CustomDropdown } from './CustomDropdown';
import { theme } from '@/constants/theme';
import { DropdownItem } from '@/constants/units';
import firestore from "@react-native-firebase/firestore";
import { useQuery, useQueryClient } from '@tanstack/react-query';

type SavedCalculator = {
    Calculator: string;
    Name: string;    
    Profile: string;
    Data: string;
    UserID: string;
  }


const getSavedCalculators = async (userId: string, calculator: string): Promise<{Profiles: DropdownItem[], States: Record<string, SavedCalculator[]>}> => {
    const queryResult = await firestore().collection("SavedCalculators").where("UserID", "==", userId).where("Calculator", "==", calculator).get();
    const result = queryResult.docs.map(doc => doc.data() as SavedCalculator);

    const deserializedResult = result.map(obj => ({
        ...obj,
        Data: JSON.parse(obj.Data)
      }));

    const groupByProfile = deserializedResult.reduce((acc, curr) => {
        const profile = curr.Profile;
        if (!acc[profile]) {
          acc[profile] = [];
        }
        acc[profile].push(curr);
        return acc;
      }, {} as Record<string, SavedCalculator[]>);

    const profiles: DropdownItem[] = Object.keys(groupByProfile).map(profile => ({
        label: profile,
        value: profile
    }));        

    console.log("Grouped", groupByProfile, "Profiles", profiles);    	
    return {
        Profiles: profiles,
        States: groupByProfile
    };
}


export const CalculatorStateManager = (props: {calculator: string, userId: string}) => {
    const [loadModalVisible, setLoadModalVisible] = useState(false);
    const [saveModalVisible, setSaveModalVisible] = useState(false);

    const showLoadModal = () => setLoadModalVisible(true);
    const hideLoadModal = () => setLoadModalVisible(false);

    const showSaveModal = () => setSaveModalVisible(true);
    const hideSaveModal = () => setSaveModalVisible(false);

    const {data: savedCalculators, isLoading} = useQuery({
        queryKey: ["savedCalculators", props.userId, props.calculator],
        queryFn: () => getSavedCalculators(props.userId, props.calculator),
    });

    
    const [calculatorStates, setCalculatorStates] = useState<SavedCalculator[]>([]);
    
    const [profiles, setProfiles] = useState<DropdownItem[]>([]);
    const [statesNames, setStatesNames] = useState<DropdownItem[]>([]);

    const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
    const [selectedState, setSelectedState] = useState<string | null>(null);

    useEffect(() => {
        if (savedCalculators) {            
            setProfiles(savedCalculators.Profiles);
            setStatesNames([]);
            setSelectedProfile(null);
            setSelectedState(null);
        }
    }, [savedCalculators]);

    const handleProfileChange = (value: string) => {        
        setSelectedProfile(value);
        setCalculatorStates(savedCalculators?.States[value] || []);
        const tempStatesNames = savedCalculators?.States[value].map(state => ({
            label: state.Name,
            value: state.Name
        }));
        setStatesNames(tempStatesNames || []);
        
        console.log("Profile", value);        
        console.log("Calculator States", savedCalculators?.States[value]);
        console.log("States Names", tempStatesNames);        
    }

    useEffect(() => {
        setSelectedState(null);
    }, [selectedProfile]);

    const handleStateChange = (value: string) => {
        setSelectedState(value);
        console.log("State", value);
    }

    // const deleteSavedCalculator = async (name: string) => {
    //     await firestore().collection("SavedCalculators").doc(name).delete();
    //     queryClient.invalidateQueries({ queryKey: ["SavedCalculators", props.userId, props.name] });
    // }

    // const saveCalculator = async (name: string, profile: string, data: string) => {
    //     await firestore().collection("SavedCalculators").add({
    //         UserId: props.userId,
    //         Name: name,
    //         Profile: profile,
    //         Data: data
    //     });
    // }

    // useEffect(() => {
    //     const un
    // }, []);


    return (
        <>
            <Portal>
                <Modal visible={saveModalVisible} onDismiss={hideSaveModal} contentContainerStyle={styles.modalContainer}>                    
                    <View style={styles.saveContrainer}>
                        {/* <CustomDropdown
                        data={profiles}
                        isModal={false}
                        value={profiles[0].value}
                        onValueChange={handleValueChange}
                        unfocusedStyle={styles.unfocusedDropdown}
                        focusedStyle={styles.focusedDropdown}>                        
                        </CustomDropdown> */}
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
                        value={selectedProfile}
                        onValueChange={handleProfileChange}
                        unfocusedStyle={styles.unfocusedDropdown}
                        focusedStyle={styles.focusedDropdown}>                        
                        </CustomDropdown>
                        <Text style={styles.text}>Cálculo:</Text>
                        <CustomDropdown
                        data={statesNames}
                        isModal={false}
                        value={selectedState}
                        onValueChange={handleStateChange}
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
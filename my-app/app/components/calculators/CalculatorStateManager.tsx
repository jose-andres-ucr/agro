import { useEffect, useState } from 'react';
import { Modal, Portal, Button, Text} from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { theme } from '@/constants/theme';
import { DropdownItem } from '@/constants/units';
import firestore from "@react-native-firebase/firestore";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dropdown } from 'react-native-element-dropdown';
import { Field } from '@/constants/types';

type SavedCalculator = {
    ID?: string
    Calculator: string;
    Name: string;    
    Profile: string;
    Data: any;
    UserID: string;
  }

const defaultProfiles = [
    {label: "Perfil 1", value: "Perfil 1"},
    {label: "Perfil 2", value: "Perfil 2"},
    {label: "Perfil 3", value: "Perfil 3"},
    {label: "Perfil 4", value: "Perfil 4"},
    {label: "Perfil 5", value: "Perfil 5"},
]

const defaultStateNamesPerProfile = [
    {label: "Guardado 1", value: "Guardado 1"},
    {label: "Guardado 2", value: "Guardado 2"},
    {label: "Guardado 3", value: "Guardado 3"},
    {label: "Guardado 4", value: "Guardado 4"},
    {label: "Guardado 5", value: "Guardado 5"},
    {label: "Guardado 6", value: "Guardado 6"},
    {label: "Guardado 7", value: "Guardado 7"},
    {label: "Guardado 8", value: "Guardado 8"},
    {label: "Guardado 9", value: "Guardado 9"},
    {label: "Guardado 10", value: "Guardado 10"},
]


const getSavedCalculators = async (userId: string, calculator: string): Promise<{Profiles: DropdownItem[], States: Record<string, SavedCalculator[]>}> => {
    const queryResult = await firestore().collection("SavedCalculators").where("UserID", "==", userId).where("Calculator", "==", calculator).get();

    const result = queryResult.docs.map(doc => {
        const data = doc.data() as Omit<SavedCalculator, "ID">;
        return {
            ...data,
            ID: doc.id,
            Data: JSON.parse(data.Data)
        } as SavedCalculator;
    });

    let groupByProfile = result.reduce((acc, curr) => {
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
    }) as DropdownItem);
       	
    return {
        Profiles: profiles,
        States: groupByProfile
    };
}

export const CalculatorStateManager = (props: {calculator: string, userId: string, onLoadData: (data: Field[]) => void, onSaveData: () => Field[]}) => {
    const [loadModalVisible, setLoadModalVisible] = useState(false);
    const [saveModalVisible, setSaveModalVisible] = useState(false);

    const showLoadModal = () => setLoadModalVisible(true);
    const hideLoadModal = () => setLoadModalVisible(false);

    const showSaveModal = () => setSaveModalVisible(true);
    const hideSaveModal = () => setSaveModalVisible(false);

    const {data: savedCalculators, isLoading: isLoadLoading} = useQuery({
        queryKey: ["savedCalculators", props.userId, props.calculator],
        queryFn: () => getSavedCalculators(props.userId, props.calculator),
    });


    const [isSaveLoading, setSaveLoading] = useState(false);
    const queryClient = useQueryClient();
    const { mutateAsync: saveCalculator } = useMutation({
        mutationFn: async ({state, id}: {state: SavedCalculator, id?: string}) => {
            setSaveLoading(true);
            if (id) {
                await firestore().collection("SavedCalculators").doc(id).update(state);
            } else {
                await firestore().collection("SavedCalculators").add(state);
            }
        },
        onSuccess: () => {
            setSaveLoading(false);
            queryClient.invalidateQueries(["savedCalculators", props.userId, props.calculator] as any);
        }
    });
    
    const [profiles, setProfiles] = useState<DropdownItem[]>([]);
    const [statesNames, setStatesNames] = useState<DropdownItem[]>([]);

    const [selectedLoadProfile, setSelectedLoadProfile] = useState<string | null>(null);
    const [selectedLoadState, setSelectedLoadState] = useState<string | null>(null);

    const [selectedSaveProfile, setSelectedSaveProfile] = useState<string | null>(null);
    const [selectedSaveState, setSelectedSaveState] = useState<string | null>(null);

    const [loadProfileFocus, setLoadProfileFocus] = useState(false);
    const [loadStateFocus, setLoadStateFocus] = useState(false);

    const [saveProfileFocus, setSaveProfileFocus] = useState(false);
    const [saveStateFocus, setSaveStateFocus] = useState(false);

    useEffect(() => {
        if (savedCalculators) {            
            setProfiles(savedCalculators.Profiles);
            setStatesNames([]);
            setSelectedLoadProfile(null);
            setSelectedLoadProfile(null);
        }
    }, [savedCalculators]);

    const handleLoadProfileChange = (item: DropdownItem) => {        
        setSelectedLoadProfile(item.value);
        // setCalculatorStates(savedCalculators?.States[item.value] || []);
        const tempStatesNames = savedCalculators?.States[item.value].map(state => ({
            label: state.Name,
            value: state.Name
        }));
        setStatesNames(tempStatesNames || []);
        setSelectedLoadState(null);    
    }

    const handleLoadStateChange = (item: DropdownItem) => {
        setSelectedLoadState(item.value);        
    }

    const handleSaveProfileChange = (item: DropdownItem) => {
        setSelectedSaveProfile(item.value);
    }

    const handleSaveStateChange = (item: DropdownItem) => {
        setSelectedSaveState(item.value);
    }

    const handleLoadState = () => {
        if (selectedLoadProfile && selectedLoadState) {          
            let state = savedCalculators?.States[selectedLoadProfile].find(state => state.Name === selectedLoadState);
            if (state) {                
                props.onLoadData(state.Data);                
            }
            hideLoadModal();
        }
    }

    const handleSaveState = async() => {
        if (selectedSaveProfile && selectedSaveState) {            
            let state = savedCalculators?.States[selectedSaveProfile]?.find(state => state.Name === selectedSaveState);            
            let stateToSave: SavedCalculator | null = null;
            if (state) {              
                stateToSave = {
                    Calculator: props.calculator,
                    Name: selectedSaveState,
                    Profile: selectedSaveProfile,
                    Data: JSON.stringify(props.onSaveData()),
                    UserID: props.userId,                    
                }               
                try {
                    await saveCalculator({state: stateToSave, id: state.ID});
                } catch (error) {
                    console.log("Error guardando el estado: ", error);
                }
            } else {
                stateToSave = {
                    Calculator: props.calculator,
                    Name: selectedSaveState,
                    Profile: selectedSaveProfile,
                    Data: JSON.stringify(props.onSaveData()),
                    UserID: props.userId
                }                
                
                try {
                    await saveCalculator({state: stateToSave});
                } catch (error) {
                    console.log("Error guardando el estado: ", error);
                }
            }
            setSelectedLoadState(null);
            setSelectedLoadProfile(null);
            hideSaveModal();
        }
    }

    return (
        <>
            <Portal>
                <Modal visible={saveModalVisible} onDismiss={hideSaveModal} contentContainerStyle={styles.modalContainer}>                    
                    <View style={styles.saveContrainer}>
                        <Text style={styles.text}>Perfil:</Text>
                        <Dropdown
                            style={saveProfileFocus ? styles.focusedDropdown : styles.unfocusedDropdown}  
                            containerStyle={styles.dropdownItem}                      
                            selectedTextStyle={styles.selectedTextStyle}
                            activeColor={styles.unfocusedDropdown.backgroundColor}
                            itemTextStyle={styles.itemTextStyle}
                            data={defaultProfiles}
                            labelField="label"
                            valueField="value"
                            mode="default"
                            maxHeight={300}
                            placeholder={selectedSaveProfile || ''}
                            value={selectedSaveProfile}
                            onFocus={() => setSaveProfileFocus(true)}
                            onBlur={() => setSaveProfileFocus(false)}
                            onChange={handleSaveProfileChange}                            
                        />
                        <Text style={styles.text}>Cálculo:</Text>
                        <Dropdown
                            style={saveStateFocus ? styles.focusedDropdown : styles.unfocusedDropdown}  
                            containerStyle={styles.dropdownItem}                      
                            selectedTextStyle={styles.selectedTextStyle}
                            activeColor={styles.unfocusedDropdown.backgroundColor}
                            itemTextStyle={styles.itemTextStyle}
                            data={defaultStateNamesPerProfile}
                            labelField="label"
                            valueField="value"
                            mode="default"
                            maxHeight={300}
                            placeholder={selectedSaveState || ''}
                            value={selectedSaveState}
                            onFocus={() => setSaveStateFocus(true)}
                            onBlur={() => setSaveStateFocus(false)}
                            onChange={handleSaveStateChange}
                        />
                        <Button
                        mode="contained"
                        loading={isSaveLoading}
                        disabled={isSaveLoading}
                        style={styles.buttonCenter}
                        labelStyle={styles.buttonText}
                        onPress={handleSaveState}
                        >
                        {isSaveLoading ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </View>
                </Modal>
            </Portal>
            <Portal>
                <Modal visible={loadModalVisible} onDismiss={hideLoadModal} contentContainerStyle={styles.modalContainer}>                    
                    <View style={styles.loadContainer}>
                        <Text style={styles.text}>Perfil:</Text>
                        <Dropdown
                            style={loadProfileFocus ? styles.focusedDropdown : styles.unfocusedDropdown}  
                            containerStyle={styles.dropdownItem}                      
                            selectedTextStyle={styles.selectedTextStyle}
                            activeColor={styles.unfocusedDropdown.backgroundColor}
                            itemTextStyle={styles.itemTextStyle}
                            data={profiles}
                            labelField="label"
                            valueField="value"
                            mode="default"
                            maxHeight={300}
                            placeholder={selectedLoadProfile || ''}
                            value={selectedLoadProfile}
                            onFocus={() => setLoadProfileFocus(true)}
                            onBlur={() => setLoadProfileFocus(false)}
                            onChange={handleLoadProfileChange}                            
                        />                        
                        <Text style={styles.text}>Cálculo:</Text>
                        <Dropdown
                            style={loadStateFocus ? styles.focusedDropdown : styles.unfocusedDropdown}  
                            containerStyle={styles.dropdownItem}                      
                            selectedTextStyle={styles.selectedTextStyle}
                            activeColor={styles.unfocusedDropdown.backgroundColor}
                            itemTextStyle={styles.itemTextStyle}
                            data={statesNames}
                            labelField="label"
                            valueField="value"
                            mode="default"
                            maxHeight={300}
                            placeholder={selectedLoadState || ''}
                            value={selectedLoadState}
                            onFocus={() => setLoadStateFocus(true)}
                            onBlur={() => setLoadStateFocus(false)}
                            onChange={handleLoadStateChange}
                        />
                        <Button
                        mode="contained"
                        loading={isLoadLoading}
                        disabled={isLoadLoading}
                        style={styles.buttonCenter}
                        labelStyle={styles.buttonText}
                        onPress={handleLoadState}
                        >
                        Cargar
                        </Button>
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
                {
                    profiles && profiles.length > 0 && <Button 
                    mode="contained"
                    style={styles.button}
                    labelStyle={styles.buttonText}
                    onPress={showLoadModal}>
                    Cargar
                    </Button>
                }
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
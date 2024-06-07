import { View, TextInput as TextInputRn, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button, Text} from "react-native-paper";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { CommentLog } from "./CommentLog";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToastError } from "@/constants/utils";
import useGlobalCalculatorStyles from "@/constants/GlobalCalculatorStyle";
import { positiveNumber } from "@/constants/schemas";
import useUnit from "@/app/hooks/useUnit";
import { convertVolume, volumeUnits } from "@/constants/units";
import { CustomDropdown } from "./CustomDropdown";


const schema = z.object({
  plantCuantity: positiveNumber,
  initialVolume: positiveNumber,
  finalVolume: positiveNumber,
  plantCuantityTotal: positiveNumber,
});

type FormData = z.infer<typeof schema>;

export default function PesticidePerPlant() {
  const styles = useGlobalCalculatorStyles();

  const { value: initialVolume, unit: initialVolumeUnit, handleUnitChange: initialVolumeHandler } = useUnit("L", 0, convertVolume);

  const { value: finalVolume, unit: finalVolumeUnit, handleUnitChange: finalVolumeHandler } = useUnit("L", 0, convertVolume);

  const { value: result, unit: resultUnit, handleUnitChange: resultHandler } = useUnit("L", 0, convertVolume);

  const [displayResult, setDisplayResult] = useState(result);  

  useEffect(() => {
    setValue("initialVolume", initialVolume);
  }, [initialVolume]);

  useEffect(() => {
    setValue("finalVolume", finalVolume);
  }, [finalVolume]);

  useEffect(() => {
    setDisplayResult(result);
  }, [result]);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormData>({    
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (errors) {
      if (errors.plantCuantity) {
        showToastError("Cantidad de plantas aplicadas", errors.plantCuantity.message);
      } else if (errors.initialVolume) {
        showToastError("Volumen inicial", errors.initialVolume.message);
      } else if (errors.finalVolume) {
        showToastError("Volumen final", errors.finalVolume.message);
      } else if (errors.plantCuantityTotal) {
        showToastError("Plantas por aplicar", errors.plantCuantityTotal.message);
      }
    }
  }, [errors]);

  const refs = {
    plantCuantityRef: React.useRef<TextInputRn>(null),
    initialVolumeRef: React.useRef<TextInputRn>(null),
    finalVolumeRef: React.useRef<TextInputRn>(null),
    cuantityTotal: React.useRef<TextInputRn>(null),
  } as const;

  useEffect(() => {
    refs.plantCuantityRef.current?.focus();
  }, []);

  const handleInitialVolumeUnitChange = (value: string) => {
    initialVolumeHandler(value, getValues("initialVolume"));
  };

  const handleFinalVolumeUnitChange = (value: string) => {
    finalVolumeHandler(value, getValues("finalVolume"));
  };

  const handleResultUnitChange = (value: string) => {
    resultHandler(value, displayResult);
  };

  const onSubmit = (data: FormData) => {
    let {
      plantCuantity,
      initialVolume,
      finalVolume,
      plantCuantityTotal,
    } = data;

    if (initialVolumeUnit !== "L") {
      initialVolume = convertVolume(initialVolume, initialVolumeUnit, "L");
    }

    if (finalVolumeUnit !== "L") {
      finalVolume = convertVolume(finalVolume, finalVolumeUnit, "L");
    }

    let result = ((initialVolume - finalVolume) * plantCuantityTotal) / plantCuantity;

    if (resultUnit !== "L") {
      result = convertVolume(result, "L", resultUnit);
    }

    setDisplayResult(result);    
  };

  return (
    <ScrollView
    contentContainerStyle={styles.scrollView}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      <View style={styles.mainContainer}>        
        <Text style={ styles.body }>Cuente un número de plantas y aplique allí agua a la velocidad usual.</Text>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.plantCuantityRef}
                  label="Cantidad de plantas aplicadas"
                  mode="outlined"
                  style={styles.inputField}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ? value.toString() : ""}                  
                  keyboardType="numeric"
                  autoCapitalize="none"
                  autoFocus
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    refs.initialVolumeRef.current?.focus();
                  }}
                  blurOnSubmit={false}
                />
              )}
              name="plantCuantity"
            />
          </View>

          <View style={styles.inputGroup}>          
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.initialVolumeRef}
                  label="Volumen inicial"
                  mode="outlined"
                  style={styles.inputField}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ? value.toString() : ""}                  
                  keyboardType="numeric"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    refs.finalVolumeRef.current?.focus();
                  }}
                  blurOnSubmit={false}
                />
              )}
              name="initialVolume"
            />
            <CustomDropdown
            data={volumeUnits}
            isModal={false}
            value={"L"}
            onValueChange={handleInitialVolumeUnitChange}>              
            </CustomDropdown>
          </View>

          <View style={styles.inputGroup}>          
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.finalVolumeRef}
                  label="Volumen final"
                  mode="outlined"
                  style={styles.inputField}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ? value.toString() : ""}                  
                  keyboardType="numeric"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    refs.cuantityTotal.current?.focus();
                  }}
                  blurOnSubmit={false}
                />
              )}
              name="finalVolume"
            />
            <CustomDropdown
            data={volumeUnits}
            isModal={false}
            value={"L"}
            onValueChange={handleFinalVolumeUnitChange}>              
            </CustomDropdown>
          </View>
          
          <View style={styles.inputGroup}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.cuantityTotal}
                  label="Cantidad de plantas por aplicar"
                  mode="outlined"
                  style={styles.inputField}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ? value.toString() : ""}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  blurOnSubmit={false}
                />
              )}
              name="plantCuantityTotal"
            />            
          </View>
        </View>        

        <Button
          style={styles.button}
          mode="contained"
          onPress={handleSubmit(onSubmit)}
        >
          Calcular
        </Button>

        <View style={styles.resultGroup}>
          <TextInput
            style={styles.resultField}
            value={displayResult?.toFixed(3)}
            editable={false}
          />
          <CustomDropdown
          data={volumeUnits}
          isModal={false}
          value={"L"}
          onValueChange={handleResultUnitChange}>              
          </CustomDropdown>
        </View>
      </View>
      <CommentLog text="PesticidePerPlantComments" />
    </ScrollView>
  );
}
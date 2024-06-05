import { View, TextInput as TextInputRn, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button, Text } from "react-native-paper";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { CommentLog } from "./CommentLog";
import { zodResolver } from "@hookform/resolvers/zod";
import useGlobalCalculatorStyles from "@/constants/GlobalCalculatorStyle";
import { showToastError } from "@/constants/utils";
import { positiveNumber } from "@/constants/schemas";
import useUnit from "@/app/hooks/useUnit";
import { areaUnits, convertArea, convertVolume, volumeUnits } from "@/constants/units";
import useCompoundUnit from "@/app/hooks/useCompoundUnit";
import { CustomDropdown } from "./CustomDropdown";
import { UnitModal } from "./UnitModal";


const schema = z.object({
  initialVolume: positiveNumber,
  finalVolume: positiveNumber,
  knownArea: positiveNumber,
});

type FormData = z.infer<typeof schema>;

export default function VolumeCalculator() {
  const styles = useGlobalCalculatorStyles();

  const { value: knownArea, unit: knownAreaUnit, handleUnitChange: knownAreaHandler} = useUnit("m²", 0, convertArea);

  const { value: initialVolume, unit: initialVolumeUnit, handleUnitChange: initialVolumeHandler} = useUnit("L", 0, convertVolume);

  const { value: finalVolume, unit: finalVolumeUnit, handleUnitChange: finalVolumeHandler } = useUnit("L", 0, convertVolume);

  const {
    value: result,
    leftUnit: resultVolumeUnit,
    rightUnit: resultAreaUnit,
    handleLeftUnitChange: resultVolumeHandler,
    handleRightUnitChange: resultAreaHandler,
  } = useCompoundUnit("L", "ha", 0, convertVolume, convertArea);

  const [displayResult, setDisplayResult] = useState(result);

  useEffect(() => {
    setValue("knownArea", knownArea);    
  }, [knownArea]);

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
      if (errors.initialVolume) {
        showToastError("Volumen inicial", errors.initialVolume.message);
      } else if (errors.finalVolume) {
        showToastError("Volumen final", errors.finalVolume.message);
      } else if (errors.knownArea) {
        showToastError("Área conocida", errors.knownArea.message);
      }
    }
  }, [errors]);

  const refs = {
    initialVolumeRef: React.useRef<TextInputRn>(null),
    finalVolumeRef: React.useRef<TextInputRn>(null),
    knownAreaRef: React.useRef<TextInputRn>(null),
  } as const;

  useEffect(() => {
    refs.initialVolumeRef.current?.focus();
  }, []);

  const handleKnownAreaUnitChange = (value: string) => {
    knownAreaHandler(value, getValues("knownArea"));
  };

  const handleInitialVolumeUnitChange = (value: string) => {
    initialVolumeHandler(value, getValues("initialVolume"));
  };

  const handleFinalVolumeUnitChange = (value: string) => {
    finalVolumeHandler(value, getValues("finalVolume"));
  };

  const handleResultVolumeUnitChange = (value: string) => {
    resultVolumeHandler(value, displayResult);
  };

  const handleResultAreaUnitChange = (value: string) => {
    resultAreaHandler(value, displayResult);
  };

  const onSubmit = (data: FormData) => {
    let { initialVolume, finalVolume, knownArea } = data;

    if (knownAreaUnit !== "m²") {
      knownArea = convertArea(knownArea, knownAreaUnit, "m²");
    }

    if (initialVolumeUnit !== "L") {
      initialVolume = convertVolume(initialVolume, initialVolumeUnit, "L");
    }

    if (finalVolumeUnit !== "L") {
      finalVolume = convertVolume(finalVolume, finalVolumeUnit, "L");
    }

    let result = ((initialVolume - finalVolume) * 10000) / knownArea;

    if (resultVolumeUnit !== "L") {
      result = convertVolume(result, "L", resultVolumeUnit);
    }

    if (resultAreaUnit !== "ha"){
      let factor = convertArea(1, "ha", resultAreaUnit);
      if (factor > 0){
        factor = 1 / factor;
      }
      result = result * factor;
    }
    
    setDisplayResult(result);
  };

  return (
    <ScrollView
    contentContainerStyle={styles.scrollView}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      <View style={styles.mainContainer}>
        <Text style={styles.header}>Volumen en área conocida</Text>
        <Text style={styles.body}>Determina el volumen de aplicación por hectárea. Marque un área
          conocida y aplique ahí agua a la velocidad usual</Text>
        <View style={styles.formContainer}>
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
                  autoFocus
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
            onValueChange={handleInitialVolumeUnitChange}
            />  
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
                    refs.knownAreaRef.current?.focus();
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
            onValueChange={handleFinalVolumeUnitChange}
            /> 
          </View>

          <View style={styles.inputGroup}>            
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.knownAreaRef}
                  label="Área conocida"
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
              name="knownArea"
            />
            <CustomDropdown
            data={areaUnits}
            isModal={false}
            value={"m²"}
            onValueChange={handleKnownAreaUnitChange}>              
            </CustomDropdown> 
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
          <UnitModal
            leftUnits={volumeUnits}
            rightUnits={areaUnits}
            leftValue={resultVolumeUnit}
            rightValue={resultAreaUnit}
            onLeftUnitChange={handleResultVolumeUnitChange}
            onRightUnitChange={handleResultAreaUnitChange}
            />
        </View>
      </View>
      <CommentLog text="KnownAreaComments" />
    </ScrollView>
  );
}
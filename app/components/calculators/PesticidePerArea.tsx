import { View, TextInput as TextInputRn, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button, Text, Divider } from "react-native-paper";
import { z } from "zod";
import React, { useContext, useEffect, useState } from "react";
import { CommentLog } from "./CommentLog";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToastError } from "@/constants/utils";
import useGlobalCalculatorStyles from "@/constants/styles/GlobalCalculatorStyle";
import { positiveNumber } from "@/constants/schemas";
import useUnit from "@/app/hooks/useUnit";
import { Unit, areaUnits, convertArea, convertVolume, volumeUnits } from "@/constants/units";
import { CustomDropdown } from "./CustomDropdown";
import { UserContext } from "@/app/hooks/context/UserContext";
import { CalculatorStateManager } from "./CalculatorStateManager";
import { Field } from "@/constants/types";


const schema = z.object({
  appliedArea: positiveNumber,
  initialVolume: positiveNumber,
  finalVolume: positiveNumber,
  cultivationArea: positiveNumber,
});

type SchemaKeys = keyof z.infer<typeof schema>;

const getFieldNames = (schema: z.ZodObject<any>) => {
  return Object.keys(schema.shape) as SchemaKeys[];
};

const fieldNames = getFieldNames(schema);

type FormData = z.infer<typeof schema>;

export default function PesticidePerArea() {
  const styles = useGlobalCalculatorStyles();
  const {userId, userData} = useContext(UserContext);

  const { value: appliedArea, unit: appliedAreaUnit, handleUnitChange: appliedAreaHandler } = useUnit("m²", 0, convertArea);

  const { value: initialVolume, unit: initialVolumeUnit, handleUnitChange: initialVolumeHandler } = useUnit("L", 0, convertVolume);

  const { value: finalVolume, unit: finalVolumeUnit, handleUnitChange: finalVolumeHandler } = useUnit("L", 0, convertVolume);

  const { value: cultivationArea, unit: cultivationAreaUnit, handleUnitChange: cultivationAreaHandler } = useUnit("m²", 0, convertArea);

  const { value: result, unit: resultUnit, handleUnitChange: resultHandler } = useUnit("L", 0, convertVolume);

  const [displayResult, setDisplayResult] = useState(result);

  useEffect(() => {
    setValue("appliedArea", appliedArea);
  }, [appliedArea]);

  useEffect(() => {
    setValue("initialVolume", initialVolume);
  }, [initialVolume]);

  useEffect(() => {
    setValue("finalVolume", finalVolume);
  }, [finalVolume]);

  useEffect(() => {
    setValue("cultivationArea", cultivationArea);
  }, [cultivationArea]);

  useEffect(() => {
    setDisplayResult(result);
  }, [result]);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (errors) {
      if (errors.appliedArea) {
        showToastError("Área aplicada", errors.appliedArea.message);
      } else if (errors.initialVolume) {
        showToastError("Volumen inicial", errors.initialVolume.message);
      } else if (errors.finalVolume) {
        showToastError("Volumen final", errors.finalVolume.message);
      } else if (errors.cultivationArea) {
        showToastError("Área por aplicar", errors.cultivationArea.message);
      }
    }
  }, [errors]);

  const refs = {
    appliedAreaRef: React.useRef<TextInputRn>(null),
    initialVolumeRef: React.useRef<TextInputRn>(null),
    finalVolumeRef: React.useRef<TextInputRn>(null),
    areaRef: React.useRef<TextInputRn>(null),
  } as const;

  useEffect(() => {
    refs.appliedAreaRef.current?.focus();
  }, []);

  const handleAppliedAreaUnitChange = (value: string) => {
    appliedAreaHandler(value, getValues("appliedArea"));
  };

  const handleInitialVolumeUnitChange = (value: string) => {
    initialVolumeHandler(value, getValues("initialVolume"));
  };

  const handleFinalVolumeUnitChange = (value: string) => {
    finalVolumeHandler(value, getValues("finalVolume"));
  };

  const handleCultivationAreaUnitChange = (value: string) => {
    cultivationAreaHandler(value, getValues("cultivationArea"));
  };

  const handleResultUnitChange = (value: string) => {
    resultHandler(value, displayResult);
  };

  const onSubmit = (data: FormData) => {
    let { appliedArea, initialVolume, finalVolume, cultivationArea } = data;

    if (appliedAreaUnit !== "m²") {
      appliedArea = convertArea(appliedArea, appliedAreaUnit, "m²");
    }

    if (initialVolumeUnit !== "L") {
      initialVolume = convertVolume(initialVolume, initialVolumeUnit, "L");
    }

    if (finalVolumeUnit !== "L") {
      finalVolume = convertVolume(finalVolume, finalVolumeUnit, "L");
    }

    if (cultivationAreaUnit !== "m²") {
      cultivationArea = convertArea(cultivationArea, cultivationAreaUnit, "m²");
    }

    let result = (((initialVolume - finalVolume) * cultivationArea) / appliedArea);

    if (resultUnit !== "L") {
      result = convertVolume(result, "L", resultUnit);
    }
    
    setDisplayResult(result);
  };

  const onLoadData = (data: Field[]) => {
    if (!data) {
      return;
    }

    reset();
    let matchingData: Field | undefined = undefined;
    fieldNames.forEach(field => {
      matchingData = data.find(d => d.name === field);
      if (matchingData) {
        let fieldName = matchingData.name;
        switch (fieldName) {
          case "appliedArea":
            let loadedAppliedAreaUnit = matchingData.unit as Unit;
            appliedAreaHandler(loadedAppliedAreaUnit.value, 0);
            break;

          case "initialVolume":
            let loadedInitialVolumeUnit = matchingData.unit as Unit;
            initialVolumeHandler(loadedInitialVolumeUnit.value, 0);
            break;
          
          case "finalVolume":
            let loadedFinalVolumeUnit = matchingData.unit as Unit;
            finalVolumeHandler(loadedFinalVolumeUnit.value, 0);
            break;
          
          case "cultivationArea":
            let loadedCultivationAreaUnit = matchingData.unit as Unit;
            cultivationAreaHandler(loadedCultivationAreaUnit.value, 0);
            break;
        }
        setValue(field, matchingData.value);
      }
    });
    matchingData = data.find(d => d.name === "result");
    if (matchingData) {
      let loadedResultUnit = matchingData.unit as Unit;
      resultHandler(loadedResultUnit.value, 0);
      setDisplayResult(matchingData.value);
    }
  }

  const onSaveData = () : Field[] => {
    return [
      {
        name: "appliedArea",
        value: getValues("appliedArea"),
        unit: {
          label: appliedAreaUnit,
          value: appliedAreaUnit,
        }
      },
      {
        name: "initialVolume",
        value: getValues("initialVolume"),
        unit: {
          label: initialVolumeUnit,
          value: initialVolumeUnit,
        }
      },
      {
        name: "finalVolume",
        value: getValues("finalVolume"),
        unit: {
          label: finalVolumeUnit,
          value: finalVolumeUnit,
        }
      },
      {
        name: "cultivationArea",
        value: getValues("cultivationArea"),
        unit: {
          label: cultivationAreaUnit,
          value: cultivationAreaUnit,    
        }
      },
      {
        name: "result",
        value: displayResult,
        unit: {
          label: resultUnit,
          value: resultUnit,
        }
      }
    ]
  }

  return (
    <ScrollView
    contentContainerStyle={styles.scrollView}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      { userData?.Role !== "Externo" && userId && <>
        <Divider></Divider>
          <CalculatorStateManager calculator="PesticidePerArea" userId={userId} onLoadData={onLoadData} onSaveData={onSaveData}/>
        <Divider></Divider>
      </>
      }
      <View style={styles.mainContainer}>
        <Text style={styles.body}>Marque un área conocida y aplique allí agua a la velocidad usual.</Text>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>          
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.appliedAreaRef}
                  label={"Área aplicada"}
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
              name="appliedArea"
            />
            <CustomDropdown
            data={areaUnits}
            isModal={false}
            value={appliedAreaUnit}
            onValueChange={handleAppliedAreaUnitChange}>              
            </CustomDropdown> 
          </View>

          <View style={styles.inputGroup}>          
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.initialVolumeRef}
                  label={"Volumen inicial"}
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
            value={initialVolumeUnit}
            onValueChange={handleInitialVolumeUnitChange}>              
            </CustomDropdown>
          </View>

          <View style={styles.inputGroup}>          
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.finalVolumeRef}
                  label={"Volumen final"}
                  mode="outlined"
                  style={styles.inputField}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ? value.toString() : ""}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    refs.areaRef.current?.focus();
                  }}
                  blurOnSubmit={false}
                />
              )}
              name="finalVolume"
            />
            <CustomDropdown
            data={volumeUnits}
            isModal={false}
            value={finalVolumeUnit}
            onValueChange={handleFinalVolumeUnitChange}>              
            </CustomDropdown>
          </View>

          <View style={styles.inputGroup}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.areaRef}
                  label={"Area por aplicar"}
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
              name="cultivationArea"
            />
            <CustomDropdown
            data={areaUnits}
            isModal={false}
            value={cultivationAreaUnit}
            onValueChange={handleCultivationAreaUnitChange}>              
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
          <CustomDropdown
            data={volumeUnits}
            isModal={false}
            value={resultUnit}
            onValueChange={handleResultUnitChange}>              
          </CustomDropdown> 
        </View>
      </View>
      { userData?.Role !== "Externo" && userId && 
        <CommentLog text="PesticidePerAreaComments" userId={userId}  role={userData?.Role}/>
      }
    </ScrollView>
  );
}
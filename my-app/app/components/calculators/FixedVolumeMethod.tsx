import { View, TextInput as TextInputRn, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button, Text, Divider } from "react-native-paper";
import { z } from "zod";
import React, { useContext, useEffect, useState } from "react";
import { CommentLog } from "./CommentLog";
import { zodResolver } from "@hookform/resolvers/zod";
import useGlobalCalculatorStyles from "@/constants/GlobalCalculatorStyle";
import { showToastError } from "@/constants/utils";
import { positiveNumber } from "@/constants/schemas";
import { CompoundUnit, Unit, convertDistance, convertTime, convertVolume, distanceUnits, timeUnits, volumeUnits } from "@/constants/units";
import useUnit from "@/app/hooks/useUnit";
import useCompoundUnit from "@/app/hooks/useCompoundUnit";
import { CustomDropdown } from "./CustomDropdown";
import { UnitModal } from "./UnitModal";
import { UserContext } from "@/app/hooks/context/UserContext";
import { Field } from "@/constants/types";
import { CalculatorStateManager } from "./CalculatorStateManager";


const schema = z.object({
  dischargePerMinute: positiveNumber,
  stripWidth: positiveNumber,
  volumePerHectare: positiveNumber,
});

type SchemaKeys = keyof z.infer<typeof schema>;

const getFieldNames = (schema: z.ZodObject<any>) => {
  return Object.keys(schema.shape) as SchemaKeys[];
};

const fieldNames = getFieldNames(schema);

type FormData = z.infer<typeof schema>;

export default function FixedVolumeMethod() {
  const styles = useGlobalCalculatorStyles();
  const {userId, userData} = useContext(UserContext);

  const { value: dischargePerMinute, unit: dischargePerMinuteUnit, handleUnitChange: dischargePerMinuteHandler} = useUnit("L", 0, convertVolume);

  const { value: stripWidth, unit: stripWidthUnit, handleUnitChange: stripWidthHandler} = useUnit("m", 0, convertDistance);

  const { value: volumePerHectare, unit: volumePerHectareUnit, handleUnitChange: volumePerHectareHandler} = useUnit("L", 0, convertVolume);

  const {
    value: result,
    leftUnit: resultDistanceUnit,
    rightUnit: resultTimeUnit,
    handleLeftUnitChange: resultDistanceHandler,
    handleRightUnitChange: resultTimeHandler
  } = useCompoundUnit("m", "seg", 0, convertDistance, convertTime);

  const [displayResult, setDisplayResult] = useState(result);

  useEffect(() => {
    setValue("dischargePerMinute", dischargePerMinute);
  }, [dischargePerMinute]);

  useEffect(() => {    
    setValue("stripWidth", stripWidth);
  }, [stripWidth]);

  useEffect(() => {
    setValue("volumePerHectare", volumePerHectare);
  }, [volumePerHectare]);

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
      if (errors.dischargePerMinute) {
        showToastError("Descarga por minuto", errors.dischargePerMinute.message);
      } else if (errors.stripWidth) {
        showToastError("Distancia entre boquillas", errors.stripWidth.message);
      } else if (errors.volumePerHectare) {
        showToastError("Volumen por hectárea", errors.volumePerHectare.message);
      }
    }
  }, [errors]);

  const refs = {
    dischargePerMinuteRef: React.useRef<TextInputRn>(null),
    stripWidthRef: React.useRef<TextInputRn>(null),
    volumePerHectareRef: React.useRef<TextInputRn>(null),
  } as const;

  useEffect(() => {
    refs.dischargePerMinuteRef.current?.focus();
  }, []);

  const handleDischargePerMinuteUnitChange = (value: string) => {
    dischargePerMinuteHandler(value, getValues("dischargePerMinute"));
  };

  const handleStripWidthUnitChange = (value: string) => {
    stripWidthHandler(value, getValues("stripWidth"));
  };

  const handleVolumePerHectareUnitChange = (value: string) => {
    volumePerHectareHandler(value, getValues("volumePerHectare"));
  };

  const handleResultDistanceUnitChange = (value: string) => {
    resultDistanceHandler(value, displayResult);
  };

  const handleResultTimeUnitChange = (value: string) => {
    resultTimeHandler(value, displayResult);
  };

  const onSubmit = (data: FormData) => {
    let { dischargePerMinute, stripWidth, volumePerHectare } = data;

    if (dischargePerMinuteUnit !== "L") {
      dischargePerMinute = convertVolume(dischargePerMinute, dischargePerMinuteUnit, "L");
    }

    if (stripWidthUnit !== "m") {
      stripWidth = convertDistance(stripWidth, stripWidthUnit, "m");
    }

    if (volumePerHectareUnit !== "L") {
      volumePerHectare = convertVolume(volumePerHectare, volumePerHectareUnit, "L");
    }

    let result = ((10000 / stripWidth) / (volumePerHectare / dischargePerMinute)) / 60;

    if (resultDistanceUnit !== "m") {
      result = convertDistance(result, "m", resultDistanceUnit);
    }

    if (resultTimeUnit !== "seg") {
      let factor = convertTime(1, "seg", resultTimeUnit);
      if (factor > 0) {
        factor = 1 / factor;
      }
      result = result * factor;
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
          case "dischargePerMinute":
            let loadedDischargePerMinuteUnit = matchingData.unit as Unit;
            dischargePerMinuteHandler(loadedDischargePerMinuteUnit.value, 0);
            break;
          
          case "stripWidth":
            let loadedStripWidthUnit = matchingData.unit as Unit;
            stripWidthHandler(loadedStripWidthUnit.value, 0);
            break;
          
          case "volumePerHectare":
            let loadedVolumePerHectareUnit = matchingData.unit as Unit;
            volumePerHectareHandler(loadedVolumePerHectareUnit.value, 0);
            break;
        }
        setValue(field, matchingData.value);
      }
    });
    matchingData = data.find(d => d.name === "result");
    if (matchingData) {
      let resultUnit = matchingData.unit as CompoundUnit;
      resultDistanceHandler(resultUnit.left?.value, 0);
      resultTimeHandler(resultUnit.right?.value, 0);
      setDisplayResult(Number(matchingData.value));
    }      
  }

  const onSaveData = (): Field[] => {
    return [
      {
        name: "dischargePerMinute",
        value: getValues("dischargePerMinute"),
        unit: {
          label: dischargePerMinuteUnit,
          value: dischargePerMinuteUnit
        }
      },
      {
        name: "stripWidth",
        value: getValues("stripWidth"),
        unit: {
          label: stripWidthUnit,
          value: stripWidthUnit
        }
      },
      {
        name: "volumePerHectare",
        value: getValues("volumePerHectare"),
        unit: {
          label: volumePerHectareUnit,
          value: volumePerHectareUnit
        }
      },
      {
        name: "result",
        value: displayResult,
        unit: {
          left: {
            label: resultDistanceUnit,
            value: resultDistanceUnit
          },
          right: {
            label: resultTimeUnit,
            value: resultTimeUnit
          }
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
          <CalculatorStateManager calculator="FixedVolumeMethod" userId={userId} onLoadData={onLoadData} onSaveData={onSaveData}/>
        <Divider></Divider>
      </>
      }
      <View style={styles.mainContainer}>        
        <Text style={styles.body}>Determina a qué velocidad se debe avanzar para aplicar el volumen del caldo deseado</Text>
        <View style={styles.formContainer}> 
          <View style={styles.inputGroup}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.dischargePerMinuteRef}
                  label="Descarga por minuto"
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
                    refs.stripWidthRef.current?.focus();
                  }}
                  blurOnSubmit={false}
                />
              )}
              name="dischargePerMinute"
            />
            <CustomDropdown
              data={volumeUnits}
              isModal={false}
              value={dischargePerMinuteUnit}
              onValueChange={handleDischargePerMinuteUnitChange}>              
              </CustomDropdown>
          </View>

          <View style={styles.inputGroup}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.stripWidthRef}
                  label="Distancia entre boquillas"
                  mode="outlined"
                  style={styles.inputField}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value ? value.toString() : ""}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    refs.volumePerHectareRef.current?.focus();
                  }}
                  blurOnSubmit={false}
                />
              )}
              name="stripWidth"
            />
            <CustomDropdown
            data={distanceUnits}
            isModal={false}
            value={stripWidthUnit}
            onValueChange={handleStripWidthUnitChange}>              
            </CustomDropdown>
          </View>

          <View style={styles.inputGroup}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.volumePerHectareRef}
                  label="Volumen por hectárea"
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
              name="volumePerHectare"
            />
            <CustomDropdown
              data={volumeUnits}
              isModal={false}
              value={volumePerHectareUnit}
              onValueChange={handleVolumePerHectareUnitChange}>              
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
            leftUnits={distanceUnits}
            rightUnits={timeUnits}
            leftValue={resultDistanceUnit}
            rightValue={resultTimeUnit}
            onLeftUnitChange={handleResultDistanceUnitChange}
            onRightUnitChange={handleResultTimeUnitChange}
          />
        </View>
      </View>
      { userData?.Role !== "Externo" && userId && 
        <CommentLog text="VolumeComments" userId={userId}  role={userData?.Role} />
      }
    </ScrollView>
  );
}
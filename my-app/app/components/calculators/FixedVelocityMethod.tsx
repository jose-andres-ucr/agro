import { View, TextInput as TextInputRn, ScrollView } from "react-native";
import { Text, TextInput, Button, Divider } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import React, { useContext, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentLog } from "./CommentLog";
import useGlobalCalculatorStyles from "@/constants/GlobalCalculatorStyle";
import { showToastError } from "@/constants/utils";
import { CustomDropdown } from "./CustomDropdown";
import { volumeUnits, distanceUnits, convertVolume, convertDistance, timeUnits, convertTime, convertArea, areaUnits, CompoundUnit, Unit} from "@/constants/units";
import useUnit from "../../hooks/useUnit";
import { UnitModal } from "./UnitModal";
import useCompoundUnit from "../../hooks/useCompoundUnit";
import { positiveNumber } from "@/constants/schemas";
import { CalculatorStateManager } from "./CalculatorStateManager";
import { Field } from "@/constants/types";
import { UserContext } from "@/app/hooks/context/UserContext";

const schema = z.object({
  dischargePerMinute: positiveNumber,
  distanceBetweenNozzles: positiveNumber,
  velocity: positiveNumber,
});

type SchemaKeys = keyof z.infer<typeof schema>;

const getFieldNames = (schema: z.ZodObject<any>) => {
  return Object.keys(schema.shape) as SchemaKeys[];
};

const fieldNames = getFieldNames(schema);

type FormData = z.infer<typeof schema>;

export default function FixedVelocityMethod() {
  const styles = useGlobalCalculatorStyles();
  const {userId, userData} = useContext(UserContext);

  const { value: dischargePerMinute, unit: dischargePerMinuteUnit, handleUnitChange: dischargePerMinuteHandler} = useUnit("L", 0, convertVolume);

  const { value: distanceBetweenNozzles, unit: distanceBetweenNozzlesUnit, handleUnitChange: distanceBetweenNozzlesHandler} = useUnit("m", 0, convertDistance);

  const {
    value: velocity,
    leftUnit: velocityDistanceUnit,
    rightUnit: velocityTimeUnit,
    handleLeftUnitChange: velocityDistanceHandler,
    handleRightUnitChange: velocityTimeHandler
  } = useCompoundUnit("m", "seg", 0, convertDistance, convertTime);

  const {
    value: result,
    leftUnit: resultVolumeUnit,
    rightUnit: resultAreaUnit,
    handleLeftUnitChange: resultVolumeHandler,
    handleRightUnitChange: resultAreaHandler
  } = useCompoundUnit("L", "ha", 0, convertVolume, convertArea);

  const [displayResult, setDisplayResult] = useState(result);

  useEffect(() => {
    setValue("dischargePerMinute", dischargePerMinute)
  }, [dischargePerMinute]);

  useEffect(() => {
    setValue("distanceBetweenNozzles", distanceBetweenNozzles)
  }, [distanceBetweenNozzles]);

  useEffect(() => {
    setValue("velocity", velocity);
  }, [velocity]);

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
      } else if (errors.distanceBetweenNozzles) {
        showToastError("Distancia entre boquillas", errors.distanceBetweenNozzles.message);
      } else if (errors.velocity) {
        showToastError("Velocidad", errors.velocity.message);
      }
    }
  }, [errors]);

  const refs = {
    dischargePerMinuteRef: React.useRef<TextInputRn>(null),
    distanceBetweenNozzlesRef: React.useRef<TextInputRn>(null),
    velocityRef: React.useRef<TextInputRn>(null),
  } as const;

  useEffect(() => {
    refs.dischargePerMinuteRef.current?.focus();
  }, []);

  const handleDischargePerMinuteUnitChange = (value: string) => {
    dischargePerMinuteHandler(value, getValues("dischargePerMinute"));
  };

  const handleDistanceBetweenNozzlesUnitChange = (value: string) => {
    distanceBetweenNozzlesHandler(value, getValues("distanceBetweenNozzles"));
  };

  const handleVelocityDistanceUnitChange = (value: string) => {
    velocityDistanceHandler(value, getValues("velocity"));
  }

  const handleVelocityTimeUnitChange = (value: string) => {
    velocityTimeHandler(value, getValues("velocity"));
  }

  const handleResultVolumeUnitChange = (value: string) => {
    resultVolumeHandler(value, displayResult);
  }

  const handleResultAreaUnitChange = (value: string) => {
    resultAreaHandler(value, displayResult);
  }

  const onSubmit = (data: FormData) => {
    let { dischargePerMinute, distanceBetweenNozzles, velocity } = data;

    if (dischargePerMinuteUnit !== "L"){
      dischargePerMinute = convertVolume(dischargePerMinute, dischargePerMinuteUnit, "L");
    }

    if (distanceBetweenNozzlesUnit !== "m"){
      distanceBetweenNozzles = convertDistance(distanceBetweenNozzles, distanceBetweenNozzlesUnit, "m");
    }

    if (velocityDistanceUnit !== "m"){
      velocity = convertDistance(velocity, velocityDistanceUnit, "m");
    }

    if (velocityTimeUnit !== "seg"){
      let factor = convertTime(1, velocityTimeUnit, "seg");
      if (factor > 0){
        factor = 1 / factor;
      }
      velocity = velocity * factor;
    }

    let result = ((dischargePerMinute * 10000) / (velocity * 60)) / distanceBetweenNozzles;

    if (resultVolumeUnit !== "L"){
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

          case "distanceBetweenNozzles":
            let loadedDistanceBetweenNozzlesUnit = matchingData.unit as Unit;              
            distanceBetweenNozzlesHandler(loadedDistanceBetweenNozzlesUnit.value, 0);
            break;

          case "velocity":            
            let loadedVelocityUnit = matchingData.unit as CompoundUnit;                
            velocityDistanceHandler(loadedVelocityUnit.left?.value, 0);
            velocityTimeHandler(loadedVelocityUnit.right?.value, 0);
            break;
        }          
        setValue(field, matchingData.value);
      }      
    });
    matchingData = data.find(d => d.name === "result");
    if (matchingData) {          
      let resultUnit = matchingData.unit as CompoundUnit;          
      resultVolumeHandler(resultUnit.left?.value, 0);
      resultAreaHandler(resultUnit.right?.value, 0);
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
        name: "distanceBetweenNozzles",
        value: getValues("distanceBetweenNozzles"),
        unit: {
          label: distanceBetweenNozzlesUnit,
          value: distanceBetweenNozzlesUnit
        }
      },
      {
        name: "velocity",
        value: getValues("velocity"),
        unit: {
          left: {
            label: velocityDistanceUnit,
            value: velocityDistanceUnit
          },
          right: {
            label: velocityTimeUnit,
            value: velocityTimeUnit
        }}
      },
      {
        name: "result",
        value: displayResult,
        unit: {
          left: {
            label: resultVolumeUnit,
            value: resultVolumeUnit
          },
          right: {
            label: resultAreaUnit,
            value: resultAreaUnit
          }
        }
      }
    ]
  };

  return (
    <ScrollView
    contentContainerStyle={styles.scrollView}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      { userData?.Role !== "Externo" && userId && <>
        <Divider></Divider>
          <CalculatorStateManager calculator="FixedVelocityMethod" userId={userId} onLoadData={onLoadData} onSaveData={onSaveData}/>
        <Divider></Divider>
      </>
      }
      <View style={styles.mainContainer}>        
        <Text style={styles.body}>Determina el volumen de caldo que se aplicará en una hectárea.
        </Text>

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
                      refs.distanceBetweenNozzlesRef.current?.focus();
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
                render={({ field: { onBlur, onChange, value} }) => (
                  <TextInput
                  ref={refs.distanceBetweenNozzlesRef}
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
                    refs.velocityRef.current?.focus();
                  }}
                  blurOnSubmit={false}
                  />
                )}
                name="distanceBetweenNozzles"
              />
              <CustomDropdown
              data={distanceUnits}
              isModal={false}
              value={distanceBetweenNozzlesUnit}
              onValueChange={handleDistanceBetweenNozzlesUnitChange}>
              </CustomDropdown>
            </View>
            <View style={styles.inputGroup}>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    ref={refs.velocityRef}
                    label="Velocidad"
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
                name="velocity"
              />
              <UnitModal
              leftUnits={distanceUnits}
              rightUnits={timeUnits}
              leftValue={velocityDistanceUnit}
              rightValue={velocityTimeUnit}
              onLeftUnitChange={handleVelocityDistanceUnitChange}
              onRightUnitChange={handleVelocityTimeUnitChange}
              />
            </View>
        </View>

        <Button
          style={styles.button}
          labelStyle={styles.buttonText}
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
      <CommentLog text="VelocityComments" />
    </ScrollView>
  );
}
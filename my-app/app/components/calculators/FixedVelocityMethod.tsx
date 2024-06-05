import { View, TextInput as TextInputRn, ScrollView } from "react-native";
import { Text, TextInput, Button, Divider } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentLog } from "./CommentLog";
import useGlobalCalculatorStyles from "@/constants/GlobalCalculatorStyle";
import { showToastError } from "@/constants/utils";
import { CustomDropdown } from "./CustomDropdown";
import { volumeUnits, distanceUnits, convertVolume, convertDistance, timeUnits, convertTime, convertArea, areaUnits, CompoundUnit} from "@/constants/units";
import useUnit from "../../hooks/useUnit";
import { UnitModal } from "./UnitModal";
import useCompoundUnit from "../../hooks/useCompoundUnit";
import { positiveNumber } from "@/constants/schemas";
import { Unit } from "@/constants/units";
import { CalculatorStateManager } from "./CalculatorStateManager";

let DBDATA = [
  {
    name: 'Fixed Velocity',
    profile: 'Profile 1',
    data: '[{"name":"dischargePerMinute","value":"0","unit":{"label":"litros","value":"L"}},{"name":"distanceBetweenNozzles","value":"0","unit":{"label":"metros","value":"m"}},{"name":"velocity","value":"0","unit":{"right":{"label":"metros","value":"m"},"left":{"label":"segundos","value":"seg"}}},{"name":"result","value":"0","unit":{"right":{"label":"litros","value":"L"},"left":{"label":"hectáreas","value":"ha"}}}]'
  },
  {
    name: 'Fixed Velocity',
    profile: 'Profile 2',
    data: '[{"name":"dischargePerMinute","value":"10","unit":{"label":"litros","value":"L"}},{"name":"distanceBetweenNozzles","value":"10","unit":{"label":"metros","value":"m"}},{"name":"velocity","value":"10","unit":{"right":{"label":"metros","value":"m"},"left":{"label":"segundos","value":"seg"}}},{"name":"result","value":"","unit":{"right":{"label":"litros","value":"L"},"left":{"label":"hectáreas","value":"ha"}}}]'
  },
  {
    name: 'Fixed Velocity',
    profile: 'Profile 3',
    data: '[{"name":"dischargePerMinute","value":"","unit":{"label":"litros","value":"L"}},{"name":"distanceBetweenNozzles","value":"","unit":{"label":"metros","value":"m"}},{"name":"velocity","value":"","unit":{"right":{"label":"metros","value":"m"},"left":{"label":"segundos","value":"seg"}}},{"name":"result","value":"","unit":{"right":{"label":"litros","value":"L"},"left":{"label":"hectáreas","value":"ha"}}}]'
  }
];

type SavedCalculator = {
  name: string;
  profile: string;
  data: string;
}

type Field = {
  name: string;
  value?: string;
  unit?: Unit | CompoundUnit;
}

const fieldMappings = {
  dischargePerMinute: "dischargePerMinute",
  distanceBetweenNozzles: "distanceBetweenNozzles",
  velocity: "velocity",
  result: "result",
}

const schema = z.object({
  dischargePerMinute: positiveNumber,
  distanceBetweenNozzles: positiveNumber,
  velocity: positiveNumber,
});

type FormData = z.infer<typeof schema>;

export default function FixedVelocityMethod() {
  const styles = useGlobalCalculatorStyles();

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


  return (
    <ScrollView
    contentContainerStyle={styles.scrollView}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    > 
      <Divider></Divider>
        <CalculatorStateManager /> 
      <Divider></Divider>
      <View style={styles.mainContainer}>
        <Text style={styles.header}>Método de velocidad fija</Text>
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
              value={"L"}
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
              value={"m"}
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
import { View, StyleSheet, TextInput as TextInputRn, ScrollView } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentLog } from "./CommentLog";


const PositiveNumberSchema = z
  .string()
  .min(1, { message: "Valor requerido" })
  .refine(
    (value) => {
      return !isNaN(Number(value));
    },
    { message: "El valor debe ser un numérico" }
  )
  .refine(
    (value) => {
      return Number(value) > 0;
    },
    { message: "El valor debe ser mayor a 0" }
  );

const FixedVelocityMethodFormSchema = z.object({
  dischargePerMinute: PositiveNumberSchema,
  distanceBetweenNozzles: PositiveNumberSchema,
  velocity: PositiveNumberSchema,
});

type FormData = z.infer<typeof FixedVelocityMethodFormSchema>;

export default function FixedVelocityMethod() {
  const [result, setResult] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      dischargePerMinute: "",
      distanceBetweenNozzles: "",
      velocity: "",
    },
    resolver: zodResolver(FixedVelocityMethodFormSchema),
  });

  const refs = {
    dischargePerMinute: React.createRef<TextInputRn>(),
    distanceBetweenNozzles: React.createRef<TextInputRn>(),
    velocity: React.createRef<TextInputRn>(),
  } as const;

  const onSubmit = (data: FormData) => {
    let raw_calculus =
      (Number(data.dischargePerMinute) * 10000) /
      (Number(data.velocity) * 60) /
      Number(data.distanceBetweenNozzles);
    setResult(raw_calculus.toFixed(3));
  };

  return (
    <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      <View style={styles.container}>
        <Text style={styles.text}>
          Determina el volumen de caldo que se aplicará en una hectárea.
        </Text>
        <View style={styles.inputGroup}>
          <Text>Descarga en 1 minuto:</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.inputField}
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ? value.toString() : ""}
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() =>
                  refs.distanceBetweenNozzles.current?.focus()
                }
              />
            )}
            name="dischargePerMinute"
          />
        </View>
        <View style={styles.containerError}>
          {errors.dischargePerMinute && (
            <Text style={styles.error}>{errors.dischargePerMinute.message}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text>Ancho de franja (metros):</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.inputField}
                mode="outlined"                
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ? value.toString() : ""}
                keyboardType="numeric"
                returnKeyType="next"
                ref={refs.distanceBetweenNozzles}
                onSubmitEditing={() => refs.velocity.current?.focus()}
              />
            )}
            name="distanceBetweenNozzles"
          />         
        </View>
        <View style={styles.containerError}>
          {errors.distanceBetweenNozzles && (
            <Text style={styles.error}>
              {errors.distanceBetweenNozzles.message}
            </Text>
          )}
        </View>        
        
        <View style={styles.inputGroup}>
          <Text>Velocidad (metros/segundo):</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.inputField}
                mode="outlined"                  
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ? value.toString() : ""}
                keyboardType="numeric"
                ref={refs.velocity}
                returnKeyType="done"
              />  
            )}
            name="velocity"
          />
        </View>
        <View style={styles.containerError}>
          {errors.velocity && (
            <Text style={styles.error}>{errors.velocity.message}</Text>
          )}
        </View>

        <Button
          style={styles.button}
          mode="contained"
          onPress={handleSubmit(onSubmit)}
        >
          Calcular
        </Button>

        <View style={styles.resultGroup}>
          <Text style={styles.text}>Resultado: </Text>
          <TextInput
            style={styles.resultField}
            value={result ? result : ""}
            editable={false}
          />
          <Text style={styles.text}> litros / hectárea</Text>
        </View>       
      </View>
      <CommentLog text="VelocityComments" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignContent: "center",
    padding: 8,
  },
  text: {
    textAlign: "center",
    fontWeight: "bold",
  },
  inputField: {
    marginVertical: 4,
    width: "30%",
    textAlign: "center",
  },
  inputGroup: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    flexDirection: "row",
  },
  button: {
    marginVertical: 8,
    alignSelf: "flex-end",
  },
  resultGroup: {
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 8,
    flexDirection: "row",
  },
  resultField: {
    width: "50%",
    textAlign: "center",
  },
  containerError: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    padding: 8,   
  },
  error: {
    color: "red",
  },
});
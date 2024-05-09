import { View, StyleSheet, TextInput as TextInputRn } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";


const PositiveNumberSchema = z.string().min(1, {message: "Valor requerido"}).
refine((value) => {
  return !isNaN(Number(value));
}, {message: "El valor debe ser un numérico"})
.refine((value) => {
  return Number(value) > 0;
}, {message: "El valor debe ser mayor a 0"});


const FixedVelocityMethodFormSchema = z.object({
  dischargePerMinute: PositiveNumberSchema,
  distanceBetweenNozzles: PositiveNumberSchema,
  velocity: PositiveNumberSchema,
})

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
    let raw_calculus = ((Number(data.dischargePerMinute) * 10000) / (Number(data.velocity) * 60)) / Number(data.distanceBetweenNozzles)
    setResult(raw_calculus.toPrecision(5));
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Determina el volumen de caldo que se aplicará en una hectárea.</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.horizontalContainer}>
            <TextInput
              style={styles.inputField}
              mode="outlined"
              label="Descarga en 1 minuto"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ? value.toString() : ""}
              keyboardType="numeric"
              returnKeyType="next"
              onSubmitEditing={() => refs.distanceBetweenNozzles.current?.focus()}
            />
            <Text style={styles.text}>litros</Text>
          </View>
        )}
        name="dischargePerMinute"
      />
      {errors.dischargePerMinute && (
        <Text style={styles.error}>{errors.dischargePerMinute.message}</Text>
      )}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.horizontalContainer}>
            <TextInput
              style={styles.inputField}
              mode="outlined"
              label="Ancho de franja"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ? value.toString() : ""}
              keyboardType="numeric"
              returnKeyType="next"
              ref={refs.distanceBetweenNozzles}
              onSubmitEditing={() => refs.velocity.current?.focus()}
            />
            <Text style={styles.text}>metros</Text>
          </View>
        )}
        name="distanceBetweenNozzles"
      />
      {errors.distanceBetweenNozzles && (
        <Text style={styles.error}>{errors.distanceBetweenNozzles.message}</Text>
      )}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.horizontalContainer}>
            <TextInput
              style={styles.inputField}
              mode="outlined"
              label="Velocidad"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value ? value.toString() : ""}
              keyboardType="numeric"
              ref={refs.velocity}
            />
            <Text style={styles.text}>metros/segundo</Text>
          </View>
        )}
        name="velocity"
      />
      {errors.velocity && <Text style={styles.error}>{errors.velocity.message}</Text>}
    
    <Button
      style={styles.button}
      mode="contained"
      onPress={handleSubmit(onSubmit)}
    >
      Calcular
    </Button>

    <View style={styles.separator} />
    {
      result && (
        <View style={styles.horizontalContainer}>
          <Text style={styles.text}>El volumen de caldo es: </Text>
          <Text style={styles.text}>{result} litros / hectárea</Text>
        </View>
      )
    }
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',    
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    padding: 28,
  },
  separator: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
  },
  text: {
    textAlign: "center",
    fontWeight: "bold",
  },
  inputField: {
    marginVertical: 6,
    width: "70%",
    marginRight: 6,
  },
  error: {
    color: "red",
  },
  button: {
    marginTop: 24,
    alignSelf: "center",
  }
});

import { View, StyleSheet, TextInput as TextInputRn, ScrollView } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentLog } from "./CommentLog";

const schema = z.object({
  dischargePerMinute: z
    .string()
    .nonempty({ message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
    distanceBetweenNozzles: z
    .string()
    .nonempty({ message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
    velocity: z
    .string()
    .nonempty({ message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
});

type FormData = z.infer<typeof schema>;

export default function FixedVelocityMethod() {
  const [resultado, setResultado] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const refs = {
    dischargePerMinuteRef: React.useRef<TextInputRn>(null),
    distanceBetweenNozzlesRef: React.useRef<TextInputRn>(null),
    velocityRef: React.useRef<TextInputRn>(null),
  } as const;

  useEffect(() => {
    refs.dischargePerMinuteRef.current?.focus();
  }, []);

  const onSubmit = (data: FormData) => {
    let raw_calculus =
      (Number(data.dischargePerMinute) * 10000) /
      (Number(data.velocity) * 60) /
      Number(data.distanceBetweenNozzles);
    setResultado(raw_calculus.toFixed(3));
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
                ref={refs.dischargePerMinuteRef}
                mode="outlined"
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value?.toString()}
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

        <Text>Litros</Text>
        </View>

        {errors.dischargePerMinute && (() => {
        console.error(errors.dischargePerMinute.message);
        return null;
        })()}   
        

        <View style={styles.inputGroup}>
          <Text>Ancho de franja:              </Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.distanceBetweenNozzlesRef}
                mode="outlined"
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value?.toString()}
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
            <Text>Metros</Text>
        </View>

        {errors.distanceBetweenNozzles && (() => {
        console.error(errors.distanceBetweenNozzles.message);
        return null;
        })()}   
        
        <View style={styles.inputGroup}>
          <Text>Velocidad:                             </Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.velocityRef}
                mode="outlined"
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value?.toString()}
                keyboardType="numeric"
                autoCapitalize="none"
                returnKeyType="send"
                onSubmitEditing={handleSubmit(onSubmit)}
                blurOnSubmit={false}
              />
            )}
            name="velocity"
          />

          <Text>     m/s     </Text>
        </View>

        {errors.velocity && (() => {
        console.error(errors.velocity.message);
        return null;
        })()}   

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
            value={resultado?.toString()}
            editable={false}
          />
          <Text style={styles.text}>litros / hectárea.</Text>
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
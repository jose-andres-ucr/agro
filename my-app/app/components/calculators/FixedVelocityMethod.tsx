import { View, StyleSheet, TextInput as TextInputRn, ScrollView } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentLog } from "./CommentLog";
import useGlobalCalculatorStyles from "@/constants/styles";
import { showToastError } from "@/constants/utils";


const schema = z.object({
  dischargePerMinute: z
    .string({required_error: "Este campo es obligatorio"})    
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),

  distanceBetweenNozzles: z
    .string({required_error: "Este campo es obligatorio"})
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
  
  velocity: z
    .string({required_error: "Este campo es obligatorio"})    
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
});

type FormData = z.infer<typeof schema>;

export default function FixedVelocityMethod() {
  const styles = useGlobalCalculatorStyles();
  const [result, setResult] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
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

  const onSubmit = (data: FormData) => {
    const { dischargePerMinute, distanceBetweenNozzles, velocity } = data;
    const result = (dischargePerMinute * 10000) / (velocity * 60) / distanceBetweenNozzles;
    setResult(result.toFixed(3));
  };


  return (
    <ScrollView
    contentContainerStyle={styles.scrollView}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      <View style={styles.mainContainer}>
        <Text style={styles.header}>Método de velocidad fija</Text>
        <Text style={styles.body}>Determina el volumen de caldo que se aplicará en una hectárea.
        </Text>
        <View>
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

          <Text style={styles.text}>Litros</Text>
          </View>        

          <View style={styles.inputGroup}>            
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.distanceBetweenNozzlesRef}
                  label="Distancia entre boquillas"
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
              <Text style={styles.text}>Metros</Text>
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

            <Text style={styles.text}>m/s</Text>
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
            value={result?.toString()}
            editable={false}
          />
          <Text style={styles.text}>litros / hectárea.</Text>
        </View>
      </View>
      <CommentLog text="VelocityComments" />
    </ScrollView>
  );
}
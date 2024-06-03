import { StyleSheet, View, TextInput as TextInputRn, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button, Text } from "react-native-paper";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { CommentLog } from "./CommentLog";
import { zodResolver } from "@hookform/resolvers/zod";
import useGlobalCalculatorStyles from "@/constants/GlobalCalculatorStyle";
import { showToastError } from "@/constants/utils";


const schema = z.object({
  initialVolume: z
    .string({required_error: "Este campo es obligatorio"})    
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),

  finalVolume: z
    .string({required_error: "Este campo es obligatorio"})
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),

  knownArea: z
    .string({required_error: "Este campo es obligatorio"})
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
});

type FormData = z.infer<typeof schema>;

export default function VolumeCalculator() {
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

  const onSubmit = (data: FormData) => {
    const { initialVolume, finalVolume, knownArea } = data;
    const result = ((initialVolume - finalVolume) * 10000) / knownArea;
    setResult(result.toFixed(3));
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
                  value={value?.toString()}
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
            <Text style={styles.text}>Litros</Text>
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
                  value={value?.toString()}
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
            <Text style={styles.text}>Litros</Text>
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
                  value={value?.toString()}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  blurOnSubmit={false}
                />
              )}
              name="knownArea"
            />
            <Text style={styles.text}>m2</Text>
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
          <Text style={styles.text}> litros / hectárea</Text>
        </View>
      </View>
      <CommentLog text="KnownAreaComments" />
    </ScrollView>
  );
}
import { StyleSheet, View, TextInput as TextInputRn, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button, Text } from "react-native-paper";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { CommentLog } from "./CommentLog";
import { zodResolver } from "@hookform/resolvers/zod";
import useGlobalCalculatorStyles from "@/constants/styles";
import { showToastError } from "@/constants/utils";


const schema = z.object({
  dischargePerMinute: z
    .string({required_error: "Este campo es obligatorio"})    
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),

  stripWidth: z
    .string({required_error: "Este campo es obligatorio"})    
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),

  volumePerHectare: z
    .string({required_error: "Este campo es obligatorio"})    
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
});

type FormData = z.infer<typeof schema>;

export default function KnownAreaMethod() {
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

  const onSubmit = (data: FormData) => {
    const { dischargePerMinute, stripWidth, volumePerHectare } = data;
    const result = (1000 / stripWidth) / (volumePerHectare / dischargePerMinute) / 60;
    setResult(result.toFixed(3));
  };

  return (
    <ScrollView
    contentContainerStyle={styles.scrollView}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      <View style={styles.mainContainer}>
        <Text style={styles.header}>Volumen fijo</Text>
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
                  value={value?.toString()}
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
            <Text style={styles.text}>Litros</Text>
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
                  value={value?.toString()}
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
            <Text style={styles.text}>Metros</Text>
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
                  value={value?.toString()}
                  keyboardType="numeric"
                  autoCapitalize="none"
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit(onSubmit)}
                  blurOnSubmit={false}
                />
              )}
              name="volumePerHectare"
            />
            <Text style={styles.text}>Litros</Text>
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
          <Text style={styles.text}> m/min.</Text>
        </View>
      </View>
      <CommentLog text="VolumeComments" />
    </ScrollView>
  );
}
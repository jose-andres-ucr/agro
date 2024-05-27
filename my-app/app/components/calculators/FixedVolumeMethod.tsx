import { StyleSheet, View, TextInput as TextInputRn, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button, Text } from "react-native-paper";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { CommentLog } from "./CommentLog";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the schema with string inputs that are refined to positive numbers
const schema = z.object({
  dischargePerMinute: z
    .string()
    .nonempty({ message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
  stripWidth: z
    .string()
    .nonempty({ message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
  volumePerHectare: z
    .string()
    .nonempty({ message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
});

type FormData = z.infer<typeof schema>;

export default function KnownAreaMethod() {
  const [result, setresult] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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
    setresult(result.toFixed(2));
  };

  return (
    <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Determina a qué velocidad se debe avanzar para aplicar el volumen del caldo deseado</Text>
        <View style={styles.inputGroup}>
          <Text>Descarga por boquilla{'\n'}(en 1 minuto): </Text>
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
                  refs.stripWidthRef.current?.focus();
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
          <Text>Ancho de franja o {'\n'}distancia entre boquillas </Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.stripWidthRef}
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
          <Text>Metros</Text>
        </View>
        
        {errors.stripWidth && (() => {
        console.error(errors.stripWidth.message);
        return null;
        })()}

        <View style={styles.inputGroup}>
          <Text>Volumen de aplicación{'\n'}por entrada</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.volumePerHectareRef}
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
          <Text>Litros</Text>
        </View>

        {errors.volumePerHectare && (() => {
        console.error(errors.volumePerHectare.message);
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
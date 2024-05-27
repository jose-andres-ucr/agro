import { StyleSheet, View, TextInput as TextInputRn, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button, Text } from "react-native-paper";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { CommentLog } from "./CommentLog";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the schema with string inputs that are refined to positive numbers
const schema = z.object({
  initialVolume: z
    .string()
    .nonempty({ message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
    finalVolume: z
    .string()
    .nonempty({ message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
    knownArea: z
    .string()
    .nonempty({ message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
});

type FormData = z.infer<typeof schema>;

export default function VolumeCalculator() {
  const [result, setresult] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

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
    setresult(result.toFixed(2));
  };

  return (
    <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Determina el volumen de aplicación por hectárea. Marque un área
          conocida y aplique ahí agua a la velocidad usual</Text>
        <View style={styles.inputGroup}>
          <Text>Volumen inicial</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.initialVolumeRef}
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
          <Text>Litros</Text>
        </View>

        {errors.initialVolume && (() => {
        console.error(errors.initialVolume.message);
        return null;
        })()}

        <View style={styles.inputGroup}>
          <Text>Volumen final</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.finalVolumeRef}
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
          <Text>Litros</Text>
        </View>
        
        {errors.finalVolume && (() => {
        console.error(errors.finalVolume.message);
        return null;
        })()}

        <View style={styles.inputGroup}>
          <Text>Área aplicada</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.knownAreaRef}
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
          <Text>m2</Text>
        </View>

        {errors.knownArea && (() => {
        console.error(errors.knownArea.message);
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
          <Text style={styles.text}> litros / hectárea</Text>
        </View>
      </View>
      <CommentLog text="KnownAreaComments" />
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
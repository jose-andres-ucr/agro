import { StyleSheet, View, TextInput as TextInputRn, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button, Text } from "react-native-paper";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { CommentLog } from "./CommentLog";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the schema with string inputs that are refined to positive numbers
const schema = z.object({
  cantidadPlantas: z
    .string()
    .nonempty({ message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
    volumenInicial: z
    .string()
    .nonempty({ message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
    volumenFinal: z
    .string()
    .nonempty({ message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
    cantidadPlantasTotal: z
    .string()
    .nonempty({ message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
});

type FormData = z.infer<typeof schema>;

export default function PesticidePerPlant() {
  const [resultado, setResultado] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const refs = {
    cantidadPlantasRef: React.useRef<TextInputRn>(null),
    volumenInicialRef: React.useRef<TextInputRn>(null),
    volumenFinalRef: React.useRef<TextInputRn>(null),
    cantidadTotal: React.useRef<TextInputRn>(null),
  } as const;

  useEffect(() => {
    refs.cantidadPlantasRef.current?.focus();
  }, []);

  const onSubmit = (data: FormData) => {
    const {
      cantidadPlantas,
      volumenInicial,
      volumenFinal,
      cantidadPlantasTotal,
    } = data;
    const result =
    ((volumenInicial - volumenFinal) * cantidadPlantasTotal) /
    cantidadPlantas;
    const resultadoRedondeado = result.toFixed(3);
    setResultado(resultadoRedondeado);
  };

  return (
    <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Cuente un número de plantas y aplique allí agua a la velocidad usual.</Text>
        <View style={styles.inputGroup}>
          <Text>Cantidad de plantas     {"\n"}aplicadas:</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.cantidadPlantasRef}
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
                  refs.volumenInicialRef.current?.focus();
                }}
                blurOnSubmit={false}
              />
            )}
            name="cantidadPlantas"
          />
          <Text>     </Text>
        </View>

        {errors.cantidadPlantas && (() => {
        console.error(errors.cantidadPlantas.message);
        return null;
        })()}

        <View style={styles.inputGroup}>
          <Text>Volumen Inicial                 </Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.volumenInicialRef}
                mode="outlined"
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value?.toString()}
                keyboardType="numeric"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  refs.volumenFinalRef.current?.focus();
                }}
                blurOnSubmit={false}
              />
            )}
            name="volumenInicial"
          />
          <Text>Litros</Text>
        </View>
        
        {errors.volumenInicial && (() => {
        console.error(errors.volumenInicial.message);
        return null;
        })()}

        <View style={styles.inputGroup}>
          <Text>Volumen final                    </Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.volumenFinalRef}
                mode="outlined"
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value?.toString()}
                keyboardType="numeric"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  refs.cantidadTotal.current?.focus();
                }}
                blurOnSubmit={false}
              />
            )}
            name="volumenFinal"
          />
          <Text>Litros</Text>
        </View>
        
        {errors.volumenFinal && (() => {
        console.error(errors.volumenFinal.message);
        return null;
        })()}

        <View style={styles.inputGroup}>
          <Text>Cantidad de plantas     {"\n"}totales en la parcela {"\n"}por aplicar:</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.cantidadTotal}
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
            name="cantidadPlantasTotal"
          />
          <Text>m2</Text>
        </View>

        {errors.cantidadPlantasTotal && (() => {
        console.error(errors.cantidadPlantasTotal.message);
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
          <Text style={styles.text}> Litros</Text>
        </View>
      </View>
      <CommentLog text="PesticidePerPlantComments" />
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
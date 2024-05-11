import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput as TextInputRn } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentLog } from "./CommentLog";


const form = z.object({
  cantidadPlantas: z.number(),
  volumenInicial: z.number(),
  volumenFinal: z.number(),
  cantidadPlantasTotal: z.number(),
});

type FormData = z.infer<typeof form>;

export default function PesticidePerPlant() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(form),
  });

  const [resultado, setResultado] = useState<number | null>(null);

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
    setResultado(parseFloat(resultadoRedondeado));
  
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      ref={(scrollView) => {
        scrollView?.scrollToEnd({ animated: true });
      }}
    >
      <View style={styles.container}>
        <Text style={styles.text}>
          Cuente un número de plantas y aplique allí agua a la velocidad usual.{" "}
        </Text>
        <View style={styles.inputGroup}>
          <Text>Cantidad de plantas {"\n"}aplicadas:</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.cantidadPlantasRef}
                mode="outlined"
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={(text) => {
                  if (text !== "" && !isNaN(parseInt(text))) {
                    onChange(parseInt(text));
                  } else {
                    onChange(null);
                  }
                }}
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
        </View>

        <View style={styles.containerError}>
          <Text style={styles.error}>
            {errors.cantidadPlantas && errors.cantidadPlantas.message === "Required"
              ? "Este campo es obligatorio"
              : errors.cantidadPlantas && errors.cantidadPlantas.message === "Expected number, received null"
              ? "El valor debe ser un número"
              : errors.cantidadPlantas && errors.cantidadPlantas.message}
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text>Volumen inicial (litros):</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.volumenInicialRef}
                mode="outlined"
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={(text) => {
                  if (text !== "" && !isNaN(parseInt(text))) {
                    onChange(parseInt(text));
                  } else {
                    onChange(null);
                  }
                }}
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
        </View>

        <View style={styles.containerError}>
          <Text style={styles.error}>
            {errors.volumenInicial && errors.volumenInicial.message === "Required"
              ? "Este campo es obligatorio"
              : errors.volumenInicial && errors.volumenInicial.message === "Expected number, received null"
              ? "El valor debe ser un número"
              : errors.volumenInicial && errors.volumenInicial.message}
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text>Volumen final (litros):</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.volumenFinalRef}
                mode="outlined"
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={(text) => {
                  if (text !== "" && !isNaN(parseInt(text))) {
                    onChange(parseInt(text));
                  } else {
                    onChange(null);
                  }
                }}
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
        </View>

        <View style={styles.containerError}>
          <Text style={styles.error}>
            {errors.volumenFinal && errors.volumenFinal.message === "Required"
              ? "Este campo es obligatorio"
              : errors.volumenFinal && errors.volumenFinal.message === "Expected number, received null"
              ? "El valor debe ser un número"
              : errors.volumenFinal && errors.volumenFinal.message}
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text>
            Cantidad de plantas totales{"\n"}en la parcela por aplicar:
          </Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.cantidadTotal}
                mode="outlined"
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={(text) => {
                  if (text !== "" && !isNaN(parseInt(text))) {
                    onChange(parseInt(text));
                  } else {
                    onChange(null);
                  }
                }}
                value={value?.toString()}
                returnKeyType="next"
                keyboardType="numeric"
                onSubmitEditing={handleSubmit((form) => {
                  onSubmit(form);
                })}
                blurOnSubmit={false}
              />
            )}
            name="cantidadPlantasTotal"
          />
        </View>

        <View style={styles.containerError}>
          <Text style={styles.error}>
            {errors.cantidadPlantasTotal && errors.cantidadPlantasTotal.message === "Required"
              ? "Este campo es obligatorio"
              : errors.cantidadPlantasTotal && errors.cantidadPlantasTotal.message === "Expected number, received null"
              ? "El valor debe ser un número"
              : errors.cantidadPlantasTotal && errors.cantidadPlantasTotal.message}
          </Text>
        </View>

        <Button
          style={styles.button}
          mode="contained"
          onPress={handleSubmit((form) => {
            onSubmit(form);
          })}
        >
          Calcular
        </Button>

        <View style={styles.resultGroup}>
          <Text style={styles.text}>Resultado: </Text>
          <TextInput
            style={styles.resultField}
            value={resultado?.toString()}
            editable={false}
          />
          <Text style={styles.text}> litros.</Text>
        </View>
      </View>
      <CommentLog text="PesticidePerPlantComments" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignContent: "center",
    padding: 28,
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
import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
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

  const onSubmit = (data: FormData) => {
    console.log(data);
    const {
      cantidadPlantas,
      volumenInicial,
      volumenFinal,
      cantidadPlantasTotal,
    } = data;
    const result =
      ((volumenInicial - volumenFinal) * cantidadPlantasTotal) /
      cantidadPlantas;
    setResultado(result);
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
                blurOnSubmit={false}
              />
            )}
            name="cantidadPlantas"
          />
          <Text></Text>
        </View>

        {errors.cantidadPlantas ? (
          <Text style={styles.error}>{errors.cantidadPlantas.message}</Text>
        ) : null}

        <View style={styles.inputGroup}>
          <Text>Volumen inicial:</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
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
                blurOnSubmit={false}
              />
            )}
            name="volumenInicial"
          />
          <Text style={styles.unitText1}>Litros</Text>
        </View>

        {errors.volumenInicial ? (
          <Text style={styles.error}>{errors.volumenInicial.message}</Text>
        ) : null}
        <View style={styles.inputGroup}>
          <Text>Volumen final (litros):</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
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
                blurOnSubmit={false}
              />
            )}
            name="volumenFinal"
          />
          <Text style={styles.unitText}>Litros</Text>
        </View>

        {errors.volumenFinal ? (
          <Text style={styles.error}>{errors.volumenFinal.message}</Text>
        ) : null}

        <View style={styles.inputGroup}>
          <Text>
            Cantidad de plantas totales{"\n"}en la parcela por aplicar:
          </Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
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
              />
            )}
            name="cantidadPlantasTotal"
          />
          <Text> </Text>
        </View>

        {errors.cantidadPlantasTotal ? (
          <Text style={styles.error}>
            {errors.cantidadPlantasTotal.message}
          </Text>
        ) : null}

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
        {resultado !== null && (
          <Text style={styles.resultText}> {resultado} litros</Text>
        )}
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
  error: {
    color: "red",
    textAlign: "center",
  },

  resultText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  unitText: {
    marginLeft: -30,
  },
  unitText1: {
    marginLeft: -65,
  },
});

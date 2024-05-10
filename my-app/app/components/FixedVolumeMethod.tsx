import { StyleSheet, View, TextInput as TextInputRn, Keyboard } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button, Text } from "react-native-paper";
import { z } from "zod";
import React, { useState } from "react";


const schema = z.object({
  descargaPorMinuto: z.string(),
  anchoDeFranja: z.string(),
  volumenPorHectarea: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function VolumeCalculator() {
  const [resultado, setResultado] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: async (data) => {
      try {
        const validData = await schema.parse(data);
        return { values: validData, errors: {} };
      } catch (error: any) {
        return { values: {}, errors: { [error.path[0]]: { message: error.message } } };
      }
    },
  });

  const onSubmit = (data: FormData) => {
    const { descargaPorMinuto, anchoDeFranja, volumenPorHectarea } = data;

    const descarga = parseFloat(descargaPorMinuto);
    const ancho = parseFloat(anchoDeFranja);
    const volumen = parseFloat(volumenPorHectarea);

    if (isNaN(descarga) || isNaN(ancho) || isNaN(volumen)) {
      console.error('Los valores ingresados no son válidos.');
      return;
    }

    const result = (1000 / ancho) / (volumen / descarga) / 60;
    setResultado(result.toFixed(2));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Determina a qué velocidad se debe avanzar para aplicar el volumen del caldo deseado</Text>
      <View style={styles.inputGroup}>
        <Text>Descarga por boquilla{'\n'}(en 1 minuto): </Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur } }) => (
            <TextInput
              mode="outlined"
              style={styles.inputField}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="numeric"
              autoCapitalize="none"
              autoFocus
              returnKeyType="next"
              blurOnSubmit={false}
            />
          )}
          name="descargaPorMinuto"
        />
        <Text>Litros</Text>
      </View>
      {errors.descargaPorMinuto && <Text style={styles.error}>{errors.descargaPorMinuto.message}</Text>}
      <View style={styles.inputGroup}>
        <Text>Ancho de franja o {'\n'}distancia entre boquillas </Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              mode="outlined"
              style={styles.inputField}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType="numeric"
              autoCapitalize="none"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          )}
          name="anchoDeFranja"
        />
            <Text>Metros</Text>
        
      </View>

      {errors.anchoDeFranja && <Text style={styles.error}>{errors.anchoDeFranja.message}</Text>}

      <View style={styles.inputGroup}>
        <Text>Volumen de aplicación{'\n'}por entrada</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur } }) => (
            <TextInput
                mode="outlined"
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="numeric"
                autoCapitalize="none"
                returnKeyType="send"
                onSubmitEditing={handleSubmit((form) => {
                  onSubmit(form);
                })}
                blurOnSubmit={false}
              />
            )}
            name="volumenPorHectarea"
        />
        <Text>Litros</Text>

      </View>
     
      {errors.volumenPorHectarea && <Text style={styles.error}>{errors.volumenPorHectarea.message}</Text>}

      <Button
        style={styles.button}
        mode="contained"
        onPress={handleSubmit((form) => {
          onSubmit(form);
        })}
      >Calcular</Button>

    <View style={styles.resultGroup}>
        <Text style={styles.text}>Resultado: </Text>
        <TextInput
          style={styles.resultField}
          value={resultado?.toString()}
          editable={false}
        />
        <Text style={styles.text}> m/min.</Text>
      </View>
    </View>
    
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

  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  result: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
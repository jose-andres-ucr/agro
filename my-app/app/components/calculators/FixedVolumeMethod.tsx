import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { View, Text, TextInput as TextInputRn, Button, StyleSheet, ScrollView } from 'react-native';
import { z } from 'zod';
import { CommentLog } from "./CommentLog";


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
    <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Determina a qué velocidad se debe avanzar para aplicar el volumen del caldo deseado</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputRn
              placeholder="Descarga por boquilla (en 1 minuto)"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
            />
          )}
          name="descargaPorMinuto"
        />
        {errors.descargaPorMinuto && <Text style={styles.error}>{errors.descargaPorMinuto.message}</Text>}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputRn
              placeholder="Ancho de franja (en metros)"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
            />
          )}
          name="anchoDeFranja"
        />
        {errors.anchoDeFranja && <Text style={styles.error}>{errors.anchoDeFranja.message}</Text>}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputRn
              placeholder="Volumen de aplicación por hectárea"
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
            />
          )}
          name="volumenPorHectarea"
        />
        {errors.volumenPorHectarea && <Text style={styles.error}>{errors.volumenPorHectarea.message}</Text>}

        <Button onPress={handleSubmit(onSubmit)} title="Calcular" />

        {resultado !== null && <Text style={styles.result}>Velocidad necesaria: {resultado} m/min</Text>}
        <CommentLog text="VolumeComments" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
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
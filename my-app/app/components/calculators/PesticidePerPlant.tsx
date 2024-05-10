import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
    formState: { errors},
  } = useForm<FormData>({

    resolver: zodResolver(form),
  });

  const [resultado, setResultado] = useState<number | null>(null);

  const onSubmit = (data: FormData) => {
    console.log(data);
    const { cantidadPlantas, volumenInicial, volumenFinal, cantidadPlantasTotal } = data;
    const result = ((volumenInicial - volumenFinal) * cantidadPlantasTotal) / cantidadPlantas;
    setResultado(result);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cuente un número de plantas y aplique allí agua a la velocidad usual. </Text>
      <View style={styles.inputItem}>
        <Text style={[styles.label]}>Cantidad de plantas aplicadas:</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input]}
              onBlur={onBlur}
              onChangeText={(text) => onChange(parseInt(text))}
              value={value?.toString()}
              returnKeyType="next"
              keyboardType="numeric"
            />
          )}
          name="cantidadPlantas"
        />
        {errors.cantidadPlantas ? (
          <Text style={styles.error}>{errors.cantidadPlantas.message}</Text>
        ) : null}
      </View>
        <View style={styles.inputItem}>
          <Text style={[styles.label]}>Volumen inicial (litros):</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input]}
                onBlur={onBlur}
                onChangeText={(text) => onChange(parseInt(text))}
                value={value?.toString()}
                returnKeyType="next"
                keyboardType="numeric"
              />
            )}
            name="volumenInicial"
          />
        {errors.volumenInicial ? (
          <Text style={styles.error}>{errors.volumenInicial.message}</Text>
        ) : null}
        </View>
        <View style={styles.inputItem}>
          <Text style={[styles.label]}>Volumen final (litros):</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input]}
                onBlur={onBlur}
                onChangeText={(text) => onChange(parseInt(text))}
                value={value?.toString()}
                returnKeyType="next"
                keyboardType="numeric"
              />
            )}
            name="volumenFinal"
          />
        {errors.volumenFinal ? (
          <Text style={styles.error}>{errors.volumenFinal.message}</Text>
        ) : null}
        </View>
        <View style={styles.inputItem}>
          <Text style={[styles.label]}>Cantidad de plantas totales en la parcela por aplicar:</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input]}
                onBlur={onBlur}
                onChangeText={(text) => onChange(parseInt(text))}
                value={value?.toString()}
                returnKeyType="next"
                keyboardType="numeric"
              />
            )}
            name="cantidadPlantasTotal"
          />
        {errors.cantidadPlantasTotal ? (
          <Text style={styles.error}>{errors.cantidadPlantasTotal.message}</Text>
        ) : null}
        </View>
      <Button
        style={styles.buttonContainer}
        mode="contained"
        onPress={handleSubmit(onSubmit)}
      >
        Calcular
      </Button>
      {resultado !== null && (
        <Text style={styles.resultText}> {resultado} litros</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textAlign: 'left',
    padding: 35,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  inputItem: {
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    width: 170,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 7,
    marginLeft: 16,
    width: 80,
    height: 50,
    backgroundColor: 'white',
  },
  buttonContainer: {
    width: '30%',
    marginLeft: 180,
    marginBottom: 25,
    backgroundColor: 'blue',
  },
  resultText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  error: {
    color: "red",
    textAlign: 'center',
  },
});
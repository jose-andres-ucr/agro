import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { View, Text, TextInput as TextInputRn, Button, StyleSheet } from 'react-native';

const schema = z.object({
  volumenInicial: z.string(),
  volumenFinal: z.string(),
  areaConocida: z.string(),
});

type FormData = z.infer<typeof schema>;

export default function KnownAreaMethod() {
  const [resultado, setResultado] = useState<string | null>(null);
  const [camposVacios, setCamposVacios] = useState(true);

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

  useEffect(() => {
    // Verificar si algún campo está vacío al cargar el componente
    const allFieldsFilled = Object.keys(errors).length === 0 && errors.constructor === Object;
    setCamposVacios(!allFieldsFilled);
  }, [errors]); // Dependencia de errores para ejecutar el efecto cuando cambien


  const onSubmit = (data: FormData) => {
    const { volumenInicial, volumenFinal, areaConocida } = data;

    // Verificar si algún campo está vacío
    if (!volumenInicial || !volumenFinal || !areaConocida) {
      setCamposVacios(true);
      console.error('Aún hay campos vacíos.');
      return;
    }

    const inicial = parseFloat(volumenInicial);
    const final = parseFloat(volumenFinal);
    const area = parseFloat(areaConocida);

    if (isNaN(inicial) || isNaN(final) || isNaN(area)) {
      console.error('Los valores ingresados no son válidos.');
      return;
    }

    const result = ((inicial - final) * 10000) / area;
    setResultado(result.toFixed(2));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Método del volumen aplicado en un área conocida</Text>
      <Text style={styles.title}>Determina el volumen de aplicación por hectárea. Marque un área conocida y 
      aplique ahí agua a la velocidad usual</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputRn
            placeholder="Volumen inicial (en litros)"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="numeric"
          />
        )}
        name="volumenInicial"
      />
      {errors.volumenInicial && <Text style={styles.error}>{errors.volumenInicial.message}</Text>}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputRn
            placeholder="Volumen final (en litros)"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="numeric"
          />
        )}
        name="volumenFinal"
      />
      {errors.volumenFinal && <Text style={styles.error}>{errors.volumenFinal.message}</Text>}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInputRn
            placeholder="Área aplicada (en metros cuadrados)"
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="numeric"
          />
        )}
        name="areaConocida"
      />
      {errors.areaConocida && <Text style={styles.error}>{errors.areaConocida.message}</Text>}

      {camposVacios && <Text style={styles.error}>Aún hay campos vacíos</Text>}

      <Button onPress={handleSubmit(onSubmit)} title="Calcular" disabled={camposVacios} />

      {resultado !== null && <Text style={styles.result}>Resultado: {resultado} litros/ha</Text>}
    </View>
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
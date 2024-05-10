import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { StyleSheet, View, TextInput as TextInputRn, Keyboard} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";

const schema = z.object({
  volumenInicial: z.string(),
  volumenFinal: z.string(),
  areaConocida: z.string(),
});

  const refs = {
    volumenInicialRef: React.useRef<TextInputRn>(null),
    volumenFinalRef: React.useRef<TextInputRn>(null),
    areaConocidaRef: React.useRef<TextInputRn>(null),
  } as const;

type FormData = z.infer<typeof schema>;

export default function KnownAreaMethod() {
  const [resultado, setResultado] = useState<string | null>(null);
  const [camposVacios, setCamposVacios] = useState(true);
  const [isFocused, setIsFocused] = useState({ // Estado para rastrear si cada cuadro de texto está enfocado
    volumenInicial: false,
    volumenFinal: false,
    areaConocida: false,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: async (data) => {
      try {
        const validData = await schema.parseAsync(data);
        return { values: validData, errors: {} };
      } catch (error: any) {
        return { values: {}, errors: { [error.path[0]]: { message: error.message } } };
      }
    },
  });

// Funciones para manejar el cambio de enfoque de cada cuadro de texto
  const handleFocus = (inputName: string) => { // Definir explícitamente el tipo de inputName como string
    setIsFocused({ ...isFocused, [inputName]: true });
  };

  const handleBlur = (inputName: string) => { // Definir explícitamente el tipo de inputName como string
    setIsFocused({ ...isFocused, [inputName]: false });
  };

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

     // Verificar si el área es negativa o cero
    if (parseFloat(areaConocida) <= 0) {
      console.error('El área no puede ser cero o negativa.');
      return;
    }

      // Verificar si algún valor es negativo
    if (parseFloat(volumenInicial) < 0) {
      console.error('No puede ingresar números negativos.');
      return;
    }

    if (parseFloat(volumenFinal) < 0) {
      console.error('No puede ingresar números negativos.');
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
      <Text style={styles.mainTitle}>Método del volumen aplicado en un área conocida</Text>
      <Text style={styles.subtitle}>Determina el volumen de aplicación por hectárea. Marque un área conocida y 
      aplique ahí agua a la velocidad usual</Text>

      <View style={styles.inputGroup}>
        <Text>Volumen inicial (litros):</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputRn
              //placeholder="Volumen inicial (en litros)"
              style={[styles.inputField, { borderColor: isFocused.volumenInicial ? '#9c27b0' : '#ccc' }]} // Cambia el color del borde según si el cuadro de texto está enfocado o no
              onBlur={() => handleBlur('volumenInicial')} // Maneja la pérdida de enfoque
              onFocus={() => handleFocus('volumenInicial')} // Maneja el enfoque
              //style={styles.inputField}
              //onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
              autoFocus
              returnKeyType="next"
              onSubmitEditing={() => {
                refs.volumenFinalRef.current?.focus();
              }}
              blurOnSubmit={false}
              
            />
          )}
          name="volumenInicial"
        />
        {errors.volumenInicial && <Text style={styles.error}>{errors.volumenInicial.message}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text>Volumen final (litros):</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputRn
              ref={refs.volumenFinalRef}
              //placeholder="Volumen final (en litros)"
              style={[styles.inputField, { borderColor: isFocused.volumenFinal ? '#9c27b0' : '#ccc' }]} // Cambia el color del borde según si el cuadro de texto está enfocado o no
              onBlur={() => handleBlur('volumenFinal')} // Maneja la pérdida de enfoque
              onFocus={() => handleFocus('volumenFinal')} // Maneja el enfoque
              //style={styles.inputField}
              //onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
              autoFocus
              returnKeyType="next"
              onSubmitEditing={() => {
                refs.areaConocidaRef.current?.focus();
              }}
              blurOnSubmit={false}
            />
          )}
          name="volumenFinal"
        />
        {errors.volumenFinal && <Text style={styles.error}>{errors.volumenFinal.message}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text>Área aplicada (m2):</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputRn
              ref={refs.areaConocidaRef}
              //placeholder="Área aplicada (en metros cuadrados)"
              style={[styles.inputField, { borderColor: isFocused.areaConocida ? '#9c27b0' : '#ccc' }]} // Cambia el color del borde según si el cuadro de texto está enfocado o no
              onBlur={() => handleBlur('areaConocida')} // Maneja la pérdida de enfoque
              onFocus={() => handleFocus('areaConocida')} // Maneja el enfoque
              //style={styles.inputField}
              //onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="numeric"
            />
          )}
          name="areaConocida"
        />
        {errors.areaConocida && <Text style={styles.error}>{errors.areaConocida.message}</Text>}
      </View>

      {camposVacios && <Text style={styles.error}>Aún hay campos vacíos</Text>}

      <Button
        style={styles.button}
        mode="contained"
        onPress={handleSubmit((form) => {
          onSubmit(form);
        })}
      >Calcular</Button>

      {resultado !== null && (
        <View style={styles.resultGroup}>
          <Text style={styles.text}>Resultado: </Text>
          <TextInputRn
            style={[styles.resultField, { color: '#000' }]}
            value={resultado.toString()}
            editable={false}
          />
          <Text style={styles.text}> litros/ha</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  
  mainTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: "#fff", // Fondo blanco
    padding: 28,
  },
  text: {
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  inputField: {
    marginVertical: 4,
    width: "30%",
    height: 50,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
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
    backgroundColor: '#6dc067', // Color verde ucr para los botones
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
    backgroundColor: "#e1d8ea",
    borderRadius: 5,
    padding: 8,
    marginTop: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
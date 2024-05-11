import { StyleSheet, View, TextInput as TextInputRn, Keyboard, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button, Text } from "react-native-paper";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { CommentLog } from "./CommentLog";
import { zodResolver } from "@hookform/resolvers/zod";


const schema = z.object({
  descargaPorMinuto: z.number(),
  anchoDeFranja: z.number(),
  volumenPorHectarea: z.number(),
});

type FormData = z.infer<typeof schema>;

export default function VolumeCalculator() {
  const [resultado, setResultado] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const refs = {
    descargaPorMinutoRef: React.useRef<TextInputRn>(null),
    anchoDeFranjaRef: React.useRef<TextInputRn>(null),
    volumenPorHectareaRef: React.useRef<TextInputRn>(null),
  } as const;

  useEffect(() => {
    refs.descargaPorMinutoRef.current?.focus();
  }, []);


  const onSubmit = (data: FormData) => {
    const { descargaPorMinuto, anchoDeFranja, volumenPorHectarea } = data;

    const result = (1000 / anchoDeFranja) / (volumenPorHectarea / descargaPorMinuto) / 60;
    setResultado(result.toFixed(2));;
  };

  return (
    <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    ref={(scrollView) => {
      scrollView?.scrollToEnd({ animated: true });
    }}
  >

    <View style={styles.container}>
      <Text style={styles.text}>Determina a qué velocidad se debe avanzar para aplicar el volumen del caldo deseado</Text>
      <View style={styles.inputGroup}>
        <Text>Descarga por boquilla{'\n'}(en 1 minuto): </Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              ref={refs.descargaPorMinutoRef}
              mode="outlined"
              style={styles.inputField}
              onBlur={onBlur}
              onChangeText={(text) => {
                if (text !== "" && !isNaN(parseInt(text))) {
                  onChange(parseInt(text));
                } else {
                  onChange("");
                }
              }}
              value={value?.toString()}
              keyboardType="numeric"
              autoCapitalize="none"
              autoFocus
              returnKeyType="next"
              onSubmitEditing={() => {
                refs.anchoDeFranjaRef.current?.focus();
              }}
              blurOnSubmit={false}
            />
          )}
          name="descargaPorMinuto"
        />
        <Text>Litros</Text>
      </View>
      <View style={styles.containerError}>
          <Text style={styles.error}>
            {errors.descargaPorMinuto && errors.descargaPorMinuto.message === "Required"
              ? "Este campo es obligatorio"
              : errors.descargaPorMinuto && errors.descargaPorMinuto.message === "Expected number, received null"
              ? "El valor debe ser un número"
              : errors.descargaPorMinuto && errors.descargaPorMinuto.message}
          </Text>
        </View>

      <View style={styles.inputGroup}>
        <Text>Ancho de franja o {'\n'}distancia entre boquillas </Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              ref={refs.anchoDeFranjaRef}
              mode="outlined"
              style={styles.inputField}
              onBlur={onBlur}
              onChangeText={(text) => {
                if (text !== "" && !isNaN(parseInt(text))) {
                  onChange(parseInt(text));
                } else {
                  onChange("");
                }
              }}
              value={value?.toString()}
              keyboardType="numeric"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                refs.volumenPorHectareaRef.current?.focus();
              }}
              blurOnSubmit={false}
            />
          )}
          name="anchoDeFranja"
        />
            <Text>Metros</Text>
        
      </View>

      <View style={styles.containerError}>
          <Text style={styles.error}>
            {errors.anchoDeFranja && errors.anchoDeFranja.message === "Required"
              ? "Este campo es obligatorio"
              : errors.anchoDeFranja && errors.anchoDeFranja.message === "Expected number, received null"
              ? "El valor debe ser un número"
              : errors.anchoDeFranja && errors.anchoDeFranja.message}
          </Text>
        </View>

      <View style={styles.inputGroup}>
        <Text>Volumen de aplicación{'\n'}por entrada</Text>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
                ref={refs.volumenPorHectareaRef}
                mode="outlined"
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={(text) => {
                  if (text !== "" && !isNaN(parseInt(text))) {
                    onChange(parseInt(text));
                  } else {
                    onChange("");
                  }
                }}
                value={value?.toString()}
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

      <View style={styles.containerError}>
          <Text style={styles.error}>
            {errors.volumenPorHectarea && errors.volumenPorHectarea.message === "Required"
              ? "Este campo es obligatorio"
              : errors.volumenPorHectarea && errors.volumenPorHectarea.message === "Expected number, received null"
              ? "El valor debe ser un número"
              : errors.volumenPorHectarea && errors.volumenPorHectarea.message}
          </Text>
        </View>
     
    
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
    <CommentLog text="VolumeComments" />
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
  containerError: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    padding: 8,   
  },
});
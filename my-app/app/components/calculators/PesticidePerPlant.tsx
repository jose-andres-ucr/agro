import { StyleSheet, View, TextInput as TextInputRn, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button, Text} from "react-native-paper";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { CommentLog } from "./CommentLog";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";

const schema = z.object({
  plantCuantity: z
    .string()
    .min(1, { message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" }),
    initialVolume: z
    .string()
    .min(1, { message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" }),
    finalVolume: z
    .string()
    .min(1, { message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" }),
    plantCuantityTotal: z
    .string()
    .min(1, { message: "Este campo es obligatorio" })
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" }),
});

type FormData = z.infer<typeof schema>;

export default function PesticidePerPlant() {
  const [result, setResult] = useState<string | null>(null);
  const showToast = (title:string, message: string | undefined) => {
    Toast.show({
      type: "error",
      text1: title,
      text2: message || "Error",
      position: "bottom",
      visibilityTime: 3000,
    });
  }  

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      plantCuantity: "",
      initialVolume: "",
      finalVolume: "",
      plantCuantityTotal: "",
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    console.log(errors);
    if (errors) {
      if (errors.plantCuantity) {
        showToast("Cantidad de plantas aplicadas", errors.plantCuantity.message);
      } else if (errors.initialVolume) {
        showToast("Volumen inicial", errors.initialVolume.message);
      } else if (errors.finalVolume) {
        showToast("Volumen final", errors.finalVolume.message);
      } else if (errors.plantCuantityTotal) {
        showToast("Plantas por aplicar", errors.plantCuantityTotal.message);
      }
    }
  }, [errors]);

  const refs = {
    plantCuantityRef: React.useRef<TextInputRn>(null),
    initialVolumeRef: React.useRef<TextInputRn>(null),
    finalVolumeRef: React.useRef<TextInputRn>(null),
    cuantityTotal: React.useRef<TextInputRn>(null),
  } as const;

  useEffect(() => {
    refs.plantCuantityRef.current?.focus();
  }, []);

  const onSubmit = (data: FormData) => {
    const {
      plantCuantity,
      initialVolume,
      finalVolume,
      plantCuantityTotal,
    } = data;

    const result = ((Number(initialVolume) - Number(finalVolume)) * Number(plantCuantityTotal)) / Number(plantCuantity);
    setResult(result.toFixed(3));
  };

  return (
    <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      <View style={styles.container}>
        <Text style={styles.header}>Cuente un número de plantas y aplique allí agua a la velocidad usual.</Text>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.plantCuantityRef}
                  label="Cantidad de plantas aplicadas"
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
                    refs.initialVolumeRef.current?.focus();
                  }}
                  blurOnSubmit={false}
                />
              )}
              name="plantCuantity"
            />
          </View>

          <View style={styles.inputGroup}>          
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.initialVolumeRef}
                  label="Volumen inicial"
                  mode="outlined"
                  style={styles.inputField}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value?.toString()}                  
                  keyboardType="numeric"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    refs.finalVolumeRef.current?.focus();
                  }}
                  blurOnSubmit={false}
                />
              )}
              name="initialVolume"
            />
            <Text style={styles.text}>Litros</Text>
          </View>

          <View style={styles.inputGroup}>          
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.finalVolumeRef}
                  label="Volumen final"
                  mode="outlined"
                  style={styles.inputField}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value?.toString()}                  
                  keyboardType="numeric"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    refs.cuantityTotal.current?.focus();
                  }}
                  blurOnSubmit={false}
                />
              )}
              name="finalVolume"
            />
            <Text style={styles.text}>Litros</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.cuantityTotal}
                  label="Cantidad de plantas por aplicar"
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
              name="plantCuantityTotal"
            />
            <Text style={styles.text}>m2</Text>
          </View>
        </View>        

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
          <Text style={styles.text}> Litros</Text>
        </View>
      </View>
      <CommentLog text="PesticidePerPlantComments" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 10,
  },
  dropdown: {    
    borderColor: "gray",
    borderWidth: 1.0,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10, 
    marginTop: 10,   
    paddingLeft: 20,
  },
  placeholderStyle: {
    fontWeight: "bold",
  },
  selectedTextStyle: {
    fontWeight: "bold",
  },
  formContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  header: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
  },
  text: {    
    fontWeight: "bold",
    alignSelf: "center",
    marginLeft: 10
  },
  inputField: {
    width: "70%",
    marginTop: 5
  },
  inputGroup: {
    flexDirection: "row"
  },
  button: {
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
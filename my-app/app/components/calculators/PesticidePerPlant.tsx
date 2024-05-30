import { View, TextInput as TextInputRn, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button, Text} from "react-native-paper";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { CommentLog } from "./CommentLog";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import useGlobalCalculatorStyles from "@/constants/styles";


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
  const calculatorStyles = useGlobalCalculatorStyles();
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
    contentContainerStyle={calculatorStyles.scrollView}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      <View style={calculatorStyles.mainContainer}>
        <Text style={calculatorStyles.header}>Calibración por planta</Text>
        <Text style={ calculatorStyles.body }>Cuente un número de plantas y aplique allí agua a la velocidad usual.</Text>
        
        <View style={calculatorStyles.formContainer}>
          <View style={calculatorStyles.inputGroup}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.plantCuantityRef}
                  label="Cantidad de plantas aplicadas"
                  mode="outlined"
                  style={calculatorStyles.inputField}
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

          <View style={calculatorStyles.inputGroup}>          
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.initialVolumeRef}
                  label="Volumen inicial"
                  mode="outlined"
                  style={calculatorStyles.inputField}
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
            <Text style={calculatorStyles.text}>Litros</Text>
          </View>

          <View style={calculatorStyles.inputGroup}>          
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.finalVolumeRef}
                  label="Volumen final"
                  mode="outlined"
                  style={calculatorStyles.inputField}
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
            <Text style={calculatorStyles.text}>Litros</Text>
          </View>
          
          <View style={calculatorStyles.inputGroup}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  ref={refs.cuantityTotal}
                  label="Cantidad de plantas por aplicar"
                  mode="outlined"
                  style={calculatorStyles.inputField}
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
            <Text style={calculatorStyles.text}>m2</Text>
          </View>
        </View>        

        <Button
          style={calculatorStyles.button}
          mode="contained"
          onPress={handleSubmit(onSubmit)}
        >
          Calcular
        </Button>

        <View style={calculatorStyles.resultGroup}>
          <TextInput
            style={calculatorStyles.resultField}
            value={result?.toString()}
            editable={false}
          />
          <Text style={calculatorStyles.text}> Litros</Text>
        </View>
      </View>
      <CommentLog text="PesticidePerPlantComments" />
    </ScrollView>
  );
}
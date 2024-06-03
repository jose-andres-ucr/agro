import { View, TextInput as TextInputRn, ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button, Text} from "react-native-paper";
import { z } from "zod";
import React, { useEffect, useState } from "react";
import { CommentLog } from "./CommentLog";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToastError } from "@/constants/utils";
import useGlobalCalculatorStyles from "@/constants/GlobalCalculatorStyle";


const schema = z.object({
  plantCuantity: z
    .string({required_error: "Este campo es obligatorio"})
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),

  initialVolume: z
    .string({required_error: "Este campo es obligatorio"})    
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),

  finalVolume: z
    .string({required_error: "Este campo es obligatorio"})    
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),

  plantCuantityTotal: z
    .string({required_error: "Este campo es obligatorio"})    
    .refine((val) => !isNaN(Number(val)), { message: "Debe ser un valor numérico" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Debe ser un número positivo" })
    .transform((val) => Number(val)),
});

type FormData = z.infer<typeof schema>;

export default function PesticidePerPlant() {
  const styles = useGlobalCalculatorStyles();
  const [result, setResult] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({    
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (errors) {
      if (errors.plantCuantity) {
        showToastError("Cantidad de plantas aplicadas", errors.plantCuantity.message);
      } else if (errors.initialVolume) {
        showToastError("Volumen inicial", errors.initialVolume.message);
      } else if (errors.finalVolume) {
        showToastError("Volumen final", errors.finalVolume.message);
      } else if (errors.plantCuantityTotal) {
        showToastError("Plantas por aplicar", errors.plantCuantityTotal.message);
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

    let result = ((initialVolume - finalVolume) * plantCuantityTotal) / plantCuantity;
    setResult(result.toFixed(3));
  };

  return (
    <ScrollView
    contentContainerStyle={styles.scrollView}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      <View style={styles.mainContainer}>
        <Text style={styles.header}>Calibración por planta</Text>
        <Text style={ styles.body }>Cuente un número de plantas y aplique allí agua a la velocidad usual.</Text>
        
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
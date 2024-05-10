import {
  StyleSheet,
  View,
  TextInput as TextInputRn,
  Keyboard,
  ScrollView
} from "react-native";
import { useForm, Controller } from "react-hook-form";

import { TextInput, Button, Text } from "react-native-paper";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { CommentLog } from "./CommentLog";

const form = z.object({
  appliedArea: z.string().transform((value) => Number(value)),
  initialVolume: z.string().transform((value) => Number(value)),
  finalVolume: z.string().transform((value) => Number(value)),
  cultivationArea: z.string().transform((value) => Number(value)),
});
type FormData = z.infer<typeof form>;

export default function PesticidePerArea() {
  const [result, setResult] = useState(0.0);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      appliedArea: 0,
      initialVolume: 0,
      finalVolume: 0,
      cultivationArea: 0,
    },
    resolver: zodResolver(form),
  });

  const refs = {
    initialVolumeRef: React.useRef<TextInputRn>(null),
    finalVolumeRef: React.useRef<TextInputRn>(null),
    areaRef: React.useRef<TextInputRn>(null),
  } as const;

  const onSubmit = (data: FormData) => {
    Keyboard.dismiss();
    let calc = (
      ((data.initialVolume - data.finalVolume) * data.cultivationArea) /
      data.appliedArea
    ).toFixed(2);
    setResult(parseInt(calc));
  };

  return (
    <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      <View style={styles.container}>
        <Text style={styles.text}>
          Marque un área conocida y aplique allí agua a la velocidad usual.
        </Text>
        <View style={styles.inputGroup}>
          <Text>Área aplicada (m2): </Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value === 0 ? "" : value.toString()}
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
            name="appliedArea"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text>Volumen Inicial (litros):</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.initialVolumeRef}
                mode="outlined"
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value === 0 ? "" : value.toString()}
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
        </View>
        <View style={styles.inputGroup}>
          <Text>Volumen final (litros):</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.finalVolumeRef}
                mode="outlined"
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value === 0 ? "" : value.toString()}
                keyboardType="numeric"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => {
                  refs.areaRef.current?.focus();
                }}
                blurOnSubmit={false}
              />
            )}
            name="finalVolume"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text>Área del cultivo por aplicar (m2):</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.areaRef}
                mode="outlined"
                style={styles.inputField}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value === 0 ? "" : value.toString()}
                keyboardType="numeric"
                autoCapitalize="none"
                returnKeyType="send"
                onSubmitEditing={handleSubmit((form) => {
                  onSubmit(form);
                })}
                blurOnSubmit={false}
              />
            )}
            name="cultivationArea"
          />
        </View>

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
            value={result.toString()}
            editable={false}
          />
          <Text style={styles.text}> litros.</Text>
        </View>
        <CommentLog text="PesticidePerAreaComments" />
      </View>
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
});

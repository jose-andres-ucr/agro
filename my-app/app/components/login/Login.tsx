import { useState } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { router } from "expo-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Text } from "react-native-paper";
import {
  StyleSheet,
  View,
  TextInput as TextInputRn,
  Keyboard,
} from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import LoadingButton from "../LoadingButton";

const form = z.object({
  userName: z.string().email({ message: "El nombre de usuario no es válido" }),
  password: z
    .string()
    .min(8, { message: "La contraseña debe contener al menos 8 caracteres" }),
});
type FormData = z.infer<typeof form>;

export default function Login() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      userName: "",
      password: "",
    },
    resolver: zodResolver(form),
  });

  const refs = {
    userName: React.useRef<TextInputRn>(null),
    password: React.useRef<TextInputRn>(null),
  } as const;

  const [invalidCredential, setInvalidCredencial] = useState<boolean | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: FormData) => {
    Keyboard.dismiss();
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(data.userName, data.password)
      .then(() => {
        if (auth().currentUser?.emailVerified) {
          console.log("User login!");
          setTimeout(() => {
            router.back();
            router.replace("/(tabs)/profile");
            setLoading(false);
          }, 2000);
        } else {
          console.log("User email no verified!");
          setInvalidCredencial(true);
          setLoading(false);
        }
      })
      .catch((error) => {
        if (error.code == "auth/invalid-credential") {
          setInvalidCredencial(true);
        }
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <View style={theme.loginContainer}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            mode="outlined"
            style={styles.inputField}
            label="Usuario"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
            onSubmitEditing={() => {
              refs.password.current?.focus();
            }}
            blurOnSubmit={false}
          />
        )}
        name="userName"
      />
      {errors.userName && (
        <Text style={styles.error}>{errors.userName.message}</Text>
      )}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            ref={refs.password}
            mode="outlined"
            style={styles.inputField}
            label="Contraseña"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry
            keyboardType="default"
            autoCapitalize="none"
            autoComplete="password"
            returnKeyType="send"
            onSubmitEditing={handleSubmit((form) => {
              onSubmit(form);
            })}
            blurOnSubmit={false}
          />
        )}
        name="password"
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      {invalidCredential ? (
        <Text style={styles.error}>
          Su usuario o contraseña son incorrectos
        </Text>
      ) : null}
      <LoadingButton
        label="Ingresar"
        isLoading={loading}
        handlePress={handleSubmit((form) => {
          onSubmit(form);
        })}
      />
      <View style={{ marginTop: 30, alignItems: "center" }}>
        <Text style={{ marginTop: 5 }}>
          ¿No posee una cuenta?{" "}
          <Text
            onPress={() => router.push("/components/signup/SignUp")}
            style={{ color: theme.colors.primary, fontWeight: "bold" }}
          >
            registrese aquí.
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontWeight: "bold",
  },
  inputField: {
    marginVertical: 4,
    width: "60%",
    textAlign: "left",
    alignSelf: "center",
  },
  button: {
    alignSelf: "center",
    marginTop: 20,
  },
  error: {
    color: "red",
    alignSelf: "center",
  },
});

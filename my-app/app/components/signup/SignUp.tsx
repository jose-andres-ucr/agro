import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Controller, useForm } from "react-hook-form";
import { TextInput, Text, Button } from "react-native-paper";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import {
  TextInput as TextInputRn,
  StyleSheet,
  ScrollView,
  Keyboard,
  View,
} from "react-native";
import CheckEmailModal from "./CheckEmailModal";
import LoadingButton from "../LoadingButton";

const form = z
  .object({
    fullname: z
      .string()
      .min(1, { message: "El nombre no es válido" })
      .max(50, {
        message: "El nombre no puede exceder los 50 caracteres",
      })
      .regex(/^[A-Z][a-z]+\s([A-Z][a-z]+|[A-Z][a-z]+\s)+$/, {
        message: "Verifique el formato del nombre",
      }),

    userRole: z.string(),

    userName: z.string().email({ message: "El correo no es válido" }),
    //.refine((email) => email.endsWith("@ucr.ac.cr"), {
    //  message: "El correo debe pertenecer al dominio @ucr.ac.cr",
    //}),

    password: z
      .string()
      .min(8, {
        message: "La contraseña debe contener al menos 8 caracteres",
      })
      .max(30, {
        message: "La contraseña no puede tener más de 30 caracteres",
      })
      .regex(/[A-Za-z]/, {
        message: "La contraseña debe contener al menos una letra",
      })
      .regex(/[0-9]/, {
        message: "La contraseña debe contener al menos un número",
      })
      .regex(/[\s!"#$%&'()*+,-./:;<=>?@^_`{|}~]/, {
        message: "La contraseña debe contener al menos un caracter especial",
      }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "La confirmación no coincide con la contraseña.",
    path: ["confirmPassword"],
  });
type FormData = z.infer<typeof form>;

export default function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: "",
      userRole: "",
      userName: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(form),
  });

  const refs = {
    fullname: React.useRef<TextInputRn>(null),
    userRole: React.useRef<TextInputRn>(null),
    userName: React.useRef<TextInputRn>(null),
    password: React.useRef<TextInputRn>(null),
    confirmPassword: React.useRef<TextInputRn>(null),
  } as const;

  const [invalidCredential, setInvalidCredencial] = useState<boolean | null>(
    null
  );

  const [checkEmail, setCheckEmail] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null | undefined>(
    null
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = (data: FormData) => {
    Keyboard.dismiss();
    setIsLoading(true);
    auth()
      .createUserWithEmailAndPassword(data.userName, data.password)
      .then(() => {
        auth()
          .currentUser?.updateProfile({ displayName: data.fullname })
          .then(() => {
            auth()
              .currentUser?.sendEmailVerification()
              .then(() => {
                console.log("Check your email");
                setUser(auth().currentUser);
                setCheckEmail(true);
                setIsLoading(false);
              })
              .catch(() => {
                console.log("Error trying to verify email");
                setIsLoading(false);
              });
          })
          .catch((error) => {
            console.log("Error");
            setIsLoading(false);
          });
      })
      .catch((error) => {
        setInvalidCredencial(true);
        setIsLoading(false);
      });
  };

  return (
    <ScrollView
      style={{ padding: 28, backgroundColor: "#FFF", paddingTop: 80 }}
    >
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            ref={refs.fullname}
            mode="outlined"
            autoFocus
            style={styles.inputField}
            label="Nombre Completo"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="default"
            autoCapitalize="none"
            autoComplete="cc-name"
            returnKeyType="next"
            onSubmitEditing={() => {
              refs.userRole.current?.focus();
            }}
            blurOnSubmit={false}
          />
        )}
        name="fullname"
      />
      {errors.fullname && (
        <Text style={styles.error}>{errors.fullname.message}</Text>
      )}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            ref={refs.userRole}
            mode="outlined"
            style={styles.inputField}
            label="Rol del usuario"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            keyboardType="default"
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => {
              refs.userName.current?.focus();
            }}
            blurOnSubmit={false}
          />
        )}
        name="userRole"
      />
      {errors.userRole && (
        <Text style={styles.error}>{errors.userRole.message}</Text>
      )}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            ref={refs.userName}
            mode="outlined"
            style={styles.inputField}
            label="Correo instituacional"
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
            returnKeyType="next"
            onSubmitEditing={() => refs.confirmPassword.current?.focus()}
            blurOnSubmit={false}
          />
        )}
        name="password"
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            ref={refs.confirmPassword}
            mode="outlined"
            style={styles.inputField}
            label="Confirmar contraseña"
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
        name="confirmPassword"
      />
      {errors.confirmPassword && (
        <Text style={styles.error}>{errors.confirmPassword.message}</Text>
      )}

      {invalidCredential ? (
        <Text style={styles.error}>El correo ya se encuentra registrado.</Text>
      ) : null}
      <CheckEmailModal checkEmail={checkEmail} userEmail={user?.email} />
      <View style={{ marginVertical: 20 }} />
      <LoadingButton
        label="Registrarme"
        isLoading={isLoading}
        handlePress={handleSubmit((form) => {
          onSubmit(form);
        })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    textAlign: "center",
    fontWeight: "bold",
  },
  inputField: {
    marginVertical: 10,
    width: "80%",
    textAlign: "left",
    alignSelf: "center",
  },
  error: {
    color: "red",
    alignSelf: "center",
  },
});

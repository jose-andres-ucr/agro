import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Controller, useForm } from "react-hook-form";
import { TextInput, Text } from "react-native-paper";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import {
  TextInput as TextInputRn,
  StyleSheet,
  ScrollView,
  Keyboard,
  View,
} from "react-native";
import CheckEmailModal from "./CheckEmailModal";
import LoadingButton from "../LoadingButton";
import firestore from "@react-native-firebase/firestore";
import DropDownRole from "./DropDownRole";

const form = z
  .object({
    fullname: z
      .string()
      .min(1, { message: "El nombre no es válido" })
      .max(50, {
        message: "El nombre no puede exceder los 50 caracteres",
      })
      .regex(
        /^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+\s([A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+|[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+\s)+$/,
        {
          message: "Verifique el formato del nombre",
        }
      ),

    userRole: z.string().min(1, { message: "Seleccione el rol" }),

    userName: z.string().email({ message: "El correo no es válido" }),

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
  })
  .refine(
    (data) =>
      ((data.userRole === "Docente" || data.userRole === "Estudiante") &&
        data.userName.endsWith("@ucr.ac.cr")) ||
      data.userRole === "Usuario Externo",
    {
      message: "El correo debe pertenecer al dominio @ucr.ac.cr",
      path: ["userName"],
    }
  )
  .refine(
    (data) =>
      (data.userRole === "Usuario Externo" &&
        !data.userName.endsWith("@ucr.ac.cr")) ||
      data.userRole === "Estudiante" ||
      data.userRole === "Docente",
    {
      message:
        "Los usuarios externos no pueden registrarse con un correo institucional",
      path: ["userName"],
    }
  );

type FormData = z.infer<typeof form>;

export default function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
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
    userRole: React.useRef(null),
    userName: React.useRef<TextInputRn>(null),
    password: React.useRef<TextInputRn>(null),
    confirmPassword: React.useRef<TextInputRn>(null),
  } as const;

  const [invalidCredential, setInvalidCredential] = useState<boolean | null>(
    null
  );

  const [checkEmail, setCheckEmail] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null | undefined>(
    null
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [role, setRole] = useState("");
  const handleRole = (role: string) => {
    setValue("userRole", role);
    setRole(role);
    clearErrors();
  };

  useEffect(() => {
    if (errors) {
      Keyboard.dismiss();
    }
  }, [errors]);

  const onSubmit = (data: FormData) => {
    Keyboard.dismiss();
    console.log(data.userRole);
    setIsLoading(true);
    auth()
      .createUserWithEmailAndPassword(data.userName, data.password)
      .then(() => {
        let user = auth().currentUser;
        firestore()
          .collection("Users")
          .doc(user?.uid)
          .set({
            Email: user?.email,
            Name: data.fullname,
            Role: data.userRole,
          })
          .then(() => {
            console.log("Data was stored successfully");
            user
              ?.updateProfile({ displayName: data.fullname })
              .then(() => {
                user
                  .sendEmailVerification()
                  .then(() => {
                    console.log("Check your email");
                    setUser(auth().currentUser);
                    setCheckEmail(true);
                    setIsLoading(false);
                    auth()
                      .signOut()
                      .catch((error) => {
                        console.log(error);
                      });
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
          .catch(() => {
            console.log("Error when trying to store data");
          });
      })
      .catch((error) => {
        console.log(error);
        setInvalidCredential(true);
        setIsLoading(false);
      });
  };

  return (
    <ScrollView
      style={{
        padding: 28,
        backgroundColor: "#FFF",
        paddingTop: 50,
      }}
    >
      <View style={{ marginBottom: 80 }}>
        <Controller
          control={control}
          render={() => <DropDownRole handleRole={handleRole} />}
          name="userRole"
        />
        {errors.userRole && (
          <Text style={styles.error}>{errors.userRole.message}</Text>
        )}
        <View style={{ display: role ? "flex" : "none" }}>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.fullname}
                mode="outlined"
                editable={role !== ""}
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
                  refs.userName.current?.focus();
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
                ref={refs.userName}
                mode="outlined"
                editable={role !== ""}
                style={styles.inputField}
                label={
                  role === "Usuario Externo"
                    ? "Correo"
                    : "Correo instituacional"
                }
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
                editable={role !== ""}
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
                editable={role !== ""}
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
            <Text style={styles.error}>
              El correo ya se encuentra registrado.
            </Text>
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
        </View>
      </View>
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

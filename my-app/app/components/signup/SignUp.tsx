import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { Controller, useForm } from "react-hook-form";
import { TextInput, Text, Card } from "react-native-paper";
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
import { showToastError } from "@/constants/utils";

const form = z
  .object({
    firstName: z
      .string()
      .min(1, { message: "El nombre no es válido" })
      .max(50, {
        message: "El nombre no puede exceder los 50 caracteres",
      }),

    lastName: z
      .string()
      .min(1, { message: "El apellido no es válido" })
      .max(50, {
        message: "El apellido no puede exceder los 50 caracteres",
      }),

    secondLastName: z.string().max(50, {
      message: "El segundo apellido no puede exceder los 50 caracteres",
    }),

    userRole: z.string().min(1, { message: "Seleccione el rol" }),

    email: z.string().email({ message: "El correo no es válido" }),

    password: z
      .string()
      .min(8, {
        message: "Debe contener al menos 8 caracteres",
      })
      .max(30, {
        message: "No puede tener más de 30 caracteres",
      })
      .regex(/[A-Za-z]/, {
        message: "Debe contener al menos una letra",
      })
      .regex(/[0-9]/, {
        message: "Debe contener al menos un número",
      })
      .regex(/[\s!"#$%&'()*+,-./:;<=>?@^_`{|}~]/, {
        message: "Debe contener al menos un caracter especial",
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
        data.email.endsWith("@ucr.ac.cr")) ||
      data.userRole === "Usuario Externo",
    {
      message: "El correo debe pertenecer al dominio @ucr.ac.cr",
      path: ["email"],
    }
  )
  .refine(
    (data) =>
      (data.userRole === "Usuario Externo" &&
        !data.email.endsWith("@ucr.ac.cr")) ||
      data.userRole === "Estudiante" ||
      data.userRole === "Docente",
    {
      message:
        "Los usuarios externos no pueden registrarse con un correo institucional",
      path: ["email"],
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
      firstName: "",
      lastName: "",
      secondLastName: "",
      userRole: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(form),
  });

  const refs = {
    firstName: React.useRef<TextInputRn>(null),
    lastName: React.useRef<TextInputRn>(null),
    secondLastName: React.useRef<TextInputRn>(null),
    userRole: React.useRef(null),
    email: React.useRef<TextInputRn>(null),
    password: React.useRef<TextInputRn>(null),
    confirmPassword: React.useRef<TextInputRn>(null),
  } as const;

  const [invalidEmail, setInvalidEmail] = useState<boolean | null>(null);

  const [checkEmail, setCheckEmail] = useState<boolean>(false);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null | undefined>(
    null
  );

  useEffect(() => {
    if (errors || invalidEmail) {
      if (errors.userRole) {
        showToastError("Rol", errors.userRole.message);
      } else if (errors.firstName) {
        showToastError("Nombre", errors.firstName.message);
      } else if (errors.lastName) {
        showToastError("Primer apellido", errors.lastName.message);
      } else if (errors.secondLastName) {
        showToastError("Segundo apellido", errors.secondLastName.message);
      } else if (errors.email) {
        showToastError("Correo", errors.email.message);
      } else if (errors.password) {
        showToastError("Contraseña", errors.password.message);
      } else if (errors.confirmPassword) {
        showToastError("Contraseña", errors.confirmPassword.message);
      } else if (invalidEmail) {
        showToastError(
          "Correo Electrónico",
          "El correo ya se encuentra registrado."
        );
      }
    }
  }, [errors, invalidEmail]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [role, setRole] = useState("");
  const handleRole = (role: string) => {
    setValue("userRole", role);
    setRole(role);
    clearErrorMessages();
    refs.firstName.current?.focus();
  };

  const clearErrorMessages = () => {
    clearErrors();
    setInvalidEmail(false);
  };

  const onSubmit = async (data: FormData) => {
    Keyboard.dismiss();
    clearErrorMessages();
    setIsLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(data.email, data.password);
      let user = auth().currentUser;

      if (user) {
        await firestore()
          .collection("Users")
          .doc(user.uid)
          .set({
            Email: data.email,
            FirstName: data.firstName,
            LastName: data.lastName,
            SecondLastName: data.secondLastName,
            Role: data.userRole,
            Approved: data.userRole === "Estudiante" ? 1 : 0,
            Verified: 0,
          });
        console.log("Data was stored successfully");

        let fullname =
          data.firstName + " " + data.lastName + " " + data.secondLastName;
        await user.updateProfile({ displayName: fullname });
        await user.sendEmailVerification();
        setUser(auth().currentUser);
        setCheckEmail(true);
        console.log("Check your email");

        auth()
          .signOut()
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error: any) {
      console.log(error);
      if (error.code == "auth/email-already-in-use") {
        console.log("The email address is already in use.");
        setInvalidEmail(true);
      } else {
        console.log("An unknown Firebase error occurred:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={{
        padding: 28,
        paddingTop: 50,
        backgroundColor: "#FFF",
      }}
    >
      <Card
        style={{
          marginBottom: 80,
          paddingBottom: 28,
          borderColor: "gray",
          borderWidth: 1,
        }}
      >
        <Card.Content>
          <Controller
            control={control}
            render={() => <DropDownRole handleRole={handleRole} />}
            name="userRole"
          />
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.firstName}
                mode="outlined"
                style={styles.inputField}
                label="Nombre"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="default"
                autoCapitalize="none"
                autoComplete="cc-name"
                returnKeyType="next"
                onSubmitEditing={() => {
                  refs.lastName.current?.focus();
                }}
                blurOnSubmit={false}
              />
            )}
            name="firstName"
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.lastName}
                mode="outlined"
                style={styles.inputField}
                label="Primer Apellido"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="default"
                autoCapitalize="none"
                autoComplete="cc-name"
                returnKeyType="next"
                onSubmitEditing={() => {
                  refs.secondLastName.current?.focus();
                }}
                blurOnSubmit={false}
              />
            )}
            name="lastName"
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.secondLastName}
                mode="outlined"
                style={styles.inputField}
                label="Segundo Apellido (opcional)"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="default"
                autoCapitalize="none"
                autoComplete="cc-name"
                returnKeyType="next"
                onSubmitEditing={() => {
                  refs.email.current?.focus();
                }}
                blurOnSubmit={false}
              />
            )}
            name="secondLastName"
          />

          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                ref={refs.email}
                mode="outlined"
                style={styles.inputField}
                label={
                  role === "Usuario Externo" ? "Correo" : "Correo institucional"
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
            name="email"
          />

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

          <CheckEmailModal checkEmail={checkEmail} userEmail={user?.email} />
          <View style={{ marginVertical: 20 }} />
          <LoadingButton
            label="Registrarme"
            isLoading={isLoading}
            handlePress={handleSubmit((form) => {
              onSubmit(form);
            })}
          />
        </Card.Content>
      </Card>
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

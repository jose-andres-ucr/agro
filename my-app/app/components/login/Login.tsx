import { useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";
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
  Image,
} from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import firestore from "@react-native-firebase/firestore";
import LoadingButton from "../LoadingButton";
import { showToastError } from "@/constants/utils";

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
    clearErrors,
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

  const [credentialError, setCredentialError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (errors || credentialError) {
      if (errors.userName) {
        showToastError("Usuario", errors.userName.message);
      } else if (errors.password) {
        showToastError("Contraseña", errors.password.message);
      } else if (credentialError) {
        showToastError("Inicio de sesión", credentialError);
      }
    }
  }, [errors, credentialError]);

  const clearErrorMessages = () => {
    clearErrors();
    setCredentialError("");
  };

  const handleSignUp = () => {
    router.push("/components/signup/SignUp");
    clearErrorMessages();
  };

  const onSubmit = async (data: FormData) => {
    Keyboard.dismiss();
    clearErrorMessages();
    setLoading(true);
    let previousUser = auth().currentUser;
    try {
      await auth().signInWithEmailAndPassword(data.userName, data.password);
      let user = auth().currentUser;
      if (user) {
        console.log(user);
        let userData = (
          await firestore().collection("Users").doc(user.uid).get()
        ).data();
        // Block login of users with unverified email or unapproved registration
        if (!user?.emailVerified) {
          setCredentialError("No ha verificado su correo electrónico");
        } else if (userData?.Approved === 0) {
          setCredentialError(
            "Se está validando su registro. Intentelo más tarde."
          );
        } else if (userData?.Approved === -1) {
          setCredentialError("Su registro no fue aprobado.");
        } else if (previousUser?.email === user?.email) {
          setCredentialError("Su sesión ya se encuentra activa");
        }
      }
    } catch (error: any) {
      if (error.code == "auth/invalid-credential") {
        setCredentialError("Su usuario o contraseña son incorrectos");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={theme.loginContainer}>
      <Image
        style={styles.logo} 
        source={require('@/assets/images/firmaHorizontal.png')} />
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

      <LoadingButton
        label="Ingresar"
        isLoading={loading}
        handlePress={handleSubmit((form) => {
          onSubmit(form);
        })}
      />
      <View style={styles.bottomText}>
        <Text style={{ marginTop: 5 }}>
          ¿No posee una cuenta?{" "}
          <Text
            onPress={handleSignUp}
            style={{ color: theme.colors.primary, fontWeight: "bold" }}
          >
            regístrese aquí.
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
  logo: {
    width: '100%', 
    height: 50,
    marginBottom: 30,
  },
  bottomText: {
    marginTop: 30, 
    marginBottom: 40,
    alignItems: "center",
  }
});

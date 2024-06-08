import React, { useContext, useEffect } from 'react';
import { UserContext } from './hooks/context/UserContext';
import { Stack, router, usePathname } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { theme } from "@/constants/theme";
import auth from "@react-native-firebase/auth";
import Toast, { ErrorToast } from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UserProvider from './hooks/context/UserProvider';


const toastConfig = {
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17,
      }}
      text2Style={{
        fontSize: 15,
      }}
      text2NumberOfLines={2}
      style={{
        borderLeftColor: theme.colors.error,
      }}
    />
  ),
};

const queryClient = new QueryClient();

export default function TabLayout() {
  const currentRoute = usePathname();
  const { userAuth, userData } = useContext(UserContext);

  useEffect(() => {
    if (userAuth && userData) {
      if (currentRoute === "/components/login/Login") {
        if (userAuth.emailVerified && userData.Approved === 1) {
          console.log("Welcome User!");
          router.back();
          router.replace("/(tabs)/");
        } else {
          // Block login of users with unverified email or unapproved registration
          console.log("Unverified user email or unapproved registration");
          auth()
            .signOut()
            .catch((error) => {
              console.log(error);
            });
        }
      }
    } else {
      if (currentRoute === "/profile") {
        console.log("User signed out");
        router.replace("/(tabs)/");
      }
    }
  }, [userData]);

  return (
    <UserProvider>
      <PaperProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen
              name="components/calculators/FixedVolumeMethod"
              options={{ headerTitle: "Método de Volumen Fijo" }}
            />
            <Stack.Screen
              name="components/calculators/FixedVelocityMethod"
              options={{ headerTitle: "Método de Velocidad Fija" }}
            />
            <Stack.Screen
              name="components/calculators/KnownAreaMethod"
              options={{ headerTitle: "Volumen en Área Conocida" }}
            />
            <Stack.Screen
              name="components/calculators/PesticidePerArea"
              options={{ headerTitle: "Calibración por Área" }}
            />
            <Stack.Screen
              name="components/calculators/PesticidePerPlant"
              options={{ headerTitle: "Calibración por Planta" }}
          />
          <Stack.Screen
            name="components/management/ApproveRegistration"
            options={{ headerTitle: "Aprobaciones de Registro" }}
            />
            <Stack.Screen
              name="components/login/Login"
              options={{ headerTitle: "Iniciar Sesión" }}
            />
          <Stack.Screen
            name="components/signup/SignUp"
            options={{ headerTitle: "Registro", headerTitleAlign: "center" }}
          />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </QueryClientProvider>      
        <Toast config={toastConfig} />
      </PaperProvider>
    </UserProvider>
  );
}

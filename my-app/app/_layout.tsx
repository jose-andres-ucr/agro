import React, { useContext, useEffect } from 'react';
import { Stack, router, usePathname } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { theme } from "@/constants/theme";
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
  return (
    <UserProvider>
      <PaperProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
        <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: theme.colors.white,
            }}
          >
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
              name="components/login/Login"
              options={{ headerTitle: "Iniciar Sesión" }}
            />
            <Stack.Screen
                name="components/management/ManageComments"
                options={{ headerTitle: "Administración de comentarios" }}
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
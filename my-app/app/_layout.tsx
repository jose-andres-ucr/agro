import React from "react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { theme } from "@/constants/theme";
import Toast, { ErrorToast } from 'react-native-toast-message';

const toastConfig = {
  error: (props: any) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontSize: 17
      }}
      text2Style={{
        fontSize: 15
      }}
      style={{
        borderLeftColor: 'red'
      }}
    />
  ),
};

export default function TabLayout() {
  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen
          name="components/calculators/FixedVolumeMethod"
          options={{ headerTitle: "Herbicidas" }}
        />
        <Stack.Screen
          name="components/calculators/FixedVelocityMethod"
          options={{ headerTitle: "Herbicidas" }}
        />
        <Stack.Screen
          name="components/calculators/KnownAreaMethod"
          options={{ headerTitle: "Herbicidas" }}
        />
        <Stack.Screen
          name="components/calculators/PesticidePerArea"
          options={{ headerTitle: "Fungicidas e Insecticidas" }}
        />
        <Stack.Screen
          name="components/calculators/PesticidePerPlant"
          options={{ headerTitle: "Fungicidas e Insecticidas" }}
        />
        <Stack.Screen
          name="components/login/Login"
          options={{ headerTitle: "Iniciar Sesión" }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <Toast config={toastConfig}/>
    </PaperProvider>    
  );
}

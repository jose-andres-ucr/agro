import React from "react";
import { Stack } from "expo-router";

export default function TabLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="components/FixedVolumeMethod"
        options={{ headerTitle: "Herbicidas" }}
      />
      <Stack.Screen
        name="components/FixedVelocityMethod"
        options={{ headerTitle: "Herbicidas" }}
      />
      <Stack.Screen
        name="components/KnownAreaMethod"
        options={{ headerTitle: "Herbicidas" }}
      />
      <Stack.Screen
        name="components/PesticidePerArea"
        options={{ headerTitle: "Fungicidas e Insecticidas" }}
      />
      <Stack.Screen
        name="components/PesticidePerPlant"
        options={{ headerTitle: "Fungicidas e Insecticidas" }}
      />
      <Stack.Screen
        name="components/login/Login"
        options={{ headerTitle: "Iniciar Sesión" }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

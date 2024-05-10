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
        options={{ 
          headerTitle: "Herbicidas",
          headerStyle: { backgroundColor: '#00c0f3' } // Color celeste ucr
        }}
      />
      <Stack.Screen
        name="components/PesticidePerArea"
        options={{ headerTitle: "Fungicidas e Insecticidas" }}
      />
      <Stack.Screen
        name="components/PesticidePerPlant"
        options={{ headerTitle: "Fungicidas e Insecticidas" }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

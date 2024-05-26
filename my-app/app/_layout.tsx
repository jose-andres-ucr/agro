import React, { useEffect } from "react";
import { Stack, router, usePathname } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { theme } from "@/constants/theme";
import useAuthState from "./hooks/Authentication";

export default function TabLayout() {
  const { userAuthState } = useAuthState();
  const currentRoute = usePathname();

  useEffect(() => {
    if (userAuthState?.emailVerified) {
      console.log("User login!");
      router.replace("/(tabs)/profile");
    } else {
      if (!userAuthState && currentRoute !== "/components/signup/SignUp") {
        console.log("User sign out or no role!");
        router.replace("/(tabs)/");
      }
    }
  }, [userAuthState]);

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
        <Stack.Screen
          name="components/signup/SignUp"
          options={{ headerTitle: "Registro" }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}

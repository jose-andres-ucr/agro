import React, { useEffect } from "react";
import { Stack, router, usePathname } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { theme } from "@/constants/theme";
import useAuthState from "./hooks/Authentication";
import auth from "@react-native-firebase/auth";

export default function TabLayout() {
  const currentRoute = usePathname();
  const { initializing, user } = useAuthState();

  useEffect(() => {
    if (user) {
      if (currentRoute === "/components/login/Login") {
        if (user?.emailVerified) {
          console.log("Welcome User!");
          router.back();
        } else {
          // Block login of users with unverified email
          console.log("Unverified user email");
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
  }, [user]);

  return (
    <PaperProvider theme={theme}>
      <Stack>
        <Stack.Screen
          name="components/calculators/FixedVolumeMethod"
          options={{
            headerTitle: "Herbicidas",
          }}
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
          options={{ headerTitle: "Registro", headerTitleAlign: "center" }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </PaperProvider>
  );
}

import React, { useEffect } from "react";
import { Stack, router, usePathname } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { theme } from "@/constants/theme";
import auth from "@react-native-firebase/auth";
import { useFetchUserData } from "./hooks/FetchData";
import Toast, { ErrorToast } from "react-native-toast-message";

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

export default function TabLayout() {
  const currentRoute = usePathname();
  const { userAuth, userData } = useFetchUserData();

  useEffect(() => {
    if (userAuth && userData) {
      if (currentRoute === "/components/login/Login") {
        if (userAuth.emailVerified && userData.Approved === 1) {
          console.log("Welcome User!");
          router.replace("/");
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
        router.replace("/");
      }
    }
  }, [userData]);

  return (
    <PaperProvider theme={theme}>
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
      <Toast config={toastConfig} />
    </PaperProvider>
  );
}
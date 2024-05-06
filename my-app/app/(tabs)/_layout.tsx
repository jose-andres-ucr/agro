import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import LoginButton from "../components/login/LoginButton";
import useAuthState from "../components/login/Authentication";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const response = useAuthState();

  let profile = null;
  if (response?.user !== null) {
    profile = "/profile";
  } else {
    profile = null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "green",
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          href: profile,
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          tabBarLabelStyle: {
            fontSize: 15,
          },
          headerRight: () => <LoginButton />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Herbicidas",
          tabBarIcon: ({ color }) => <TabBarIcon name="leaf" color={color} />,
          tabBarLabelStyle: {
            fontSize: 15,
          },
          headerRight: () => <LoginButton />,
        }}
      />
      <Tabs.Screen
        name="fungicides"
        options={{
          title: "Fungicidas e Insecticidas",
          tabBarIcon: ({ color }) => <TabBarIcon name="bug" color={color} />,
          tabBarLabelStyle: {
            fontSize: 15,
          },
          headerRight: () => <LoginButton />,
        }}
      />
    </Tabs>
  );
}

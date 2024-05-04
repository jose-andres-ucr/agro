import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Pressable } from "react-native";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "green",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Herbicidas",
          tabBarIcon: ({ color }) => <TabBarIcon name="leaf" color={color} />,
          tabBarLabelStyle: {
            fontSize: 15,
          },
          headerRight: () => (
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="sign-in"
                  size={25}
                  color={"black"}
                  style={{ marginRight: 20, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
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
          headerRight: () => (
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="sign-in"
                  size={25}
                  color={"black"}
                  style={{ marginRight: 20, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
    </Tabs>
  );
}

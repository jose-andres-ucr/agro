import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import LoginButton from "../components/login/LoginButton";
import useuserRole from "../hooks/UserRole";
import TabBarIcon from "../components/TabBarIcon";

export default function TabLayout() {
  const { profile, manageUsers, education } = useuserRole();

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
        name="education"
        options={{
          title: "Educación",
          href: education,
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
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
      <Tabs.Screen
        name="manageUsers"
        options={{
          title: "Usuarios",
          href: manageUsers,
          tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
          tabBarLabelStyle: {
            fontSize: 15,
          },
          headerRight: () => <LoginButton />,
        }}
      />
    </Tabs>
  );
}

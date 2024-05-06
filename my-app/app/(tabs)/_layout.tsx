import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import LoginButton from "../components/login/LoginButton";
import useFetchUserData from "../hooks/FetchData";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  // Get info about user authentication state (sign in or out) and user data (name, roll, etc)
  const { userData } = useFetchUserData();

  //Get User Roll
  const [userRoll, setUserRoll] = useState<string | null>(null);
  const [profile, setProfile] = useState<string | null>(null);
  const [manageUsers, setManageUsers] = useState<string | null>(null);
  const [education, setEducation] = useState<string | null>(null);
  useEffect(() => {
    if (userData) {
      setUserRoll(userData.Roll);
    } else {
      // handle sign out
      setUserRoll(null);
      setProfile(null);
      setEducation(null);
      setManageUsers(null);
    }
  }, [userData]);

  // Show specific roll functionalities
  useEffect(() => {
    if (userRoll == "Admin") {
      setProfile("/profile");
      setManageUsers("/manageUsers");
    } else if (userRoll == "Professor") {
      setProfile("/profile");
      setEducation("/education");
      setManageUsers("/manageUsers");
    } else if (userRoll == "Student") {
      setProfile("/profile");
      setProfile("/education");
    } else if (userRoll == "External User") {
      setProfile("/profile");
    } else {
      // no roll
      setUserRoll(null);
      setProfile(null);
      setEducation(null);
      setManageUsers(null);
    }
  }, [userRoll]);

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
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
          tabBarLabelStyle: {
            fontSize: 15,
          },
          headerRight: () => <LoginButton />,
        }}
      />
    </Tabs>
  );
}

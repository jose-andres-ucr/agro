import { View, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Button } from "react-native-paper";
import { theme } from "@/constants/theme";

export default function GroupInformation() {
  const { id } = useLocalSearchParams();

  useEffect(() => {
    console.log("ID del grupo:", id);
  }, [id]);

  return (
    <View>
      <Text>ID del grupo: {id}</Text>
      <Button
        mode="contained"
        buttonColor={theme.colors.primary}
        style={{
          width: "75%",
          alignSelf: "flex-end",
          marginVertical: 10,
          marginRight: 20,
        }}
        labelStyle={{ fontSize: 16 }}
        onPress={() =>
          router.push(`../management/manageEducationalMaterial/${id}`)
        }
      >
        Administrar Material Educativo
      </Button>
      <Button
        mode="contained"
        buttonColor={theme.colors.primary}
        style={{
          width: "75%",
          alignSelf: "flex-end",
          marginVertical: 10,
          marginRight: 20,
        }}
        labelStyle={{ fontSize: 16 }}
        onPress={() => router.push(`../management/manageGroupStudents/${id}`)}
      >
        Administración de estudiantes
      </Button>
      <Text>Material Educativo</Text>
      <Button
        mode="contained"
        buttonColor="red"
        style={{
          width: "50%",
          alignSelf: "flex-end",
          marginVertical: 30,
          marginRight: 20,
        }}
        labelStyle={{ fontSize: 16 }}
        onPress={() => router.push(`../management/deleteGroup/${id}`)}
      >
        Eliminar Grupo
      </Button>
    </View>
  );
}

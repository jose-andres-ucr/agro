import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View, Text } from "react-native";

export default function ManageStudents() {
  const { id } = useLocalSearchParams();

  useEffect(() => {
    console.log("ID del grupo:", id);
  }, [id]);
  return (
    <View>
      <Text>Mostrar Lista de Estudiantes Matriculados en el grupo {id}</Text>
      <Text>Agregar Estudiante</Text>
      <Text>Borrar Estudiante</Text>
    </View>
  );
}

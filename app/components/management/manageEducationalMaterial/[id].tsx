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
      <Text>Administrar material educativo del grupo {id}</Text>
    </View>
  );
}

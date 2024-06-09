import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable } from "react-native";

export default function ProfileButton() {
  return (
    <Pressable onPress={() => router.navigate("/(tabs)/profile")}>
      {({ pressed }) => (
        <FontAwesome6
          name="user-large"
          size={25}
          color={"white"}
          style={{ marginRight: 20, opacity: pressed ? 0.5 : 1 }}
        />
      )}
    </Pressable>
  );
}

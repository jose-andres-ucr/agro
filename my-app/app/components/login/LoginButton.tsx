import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable } from "react-native";

export default function LoginButton() {
  return (
    <Pressable onPress={() => router.push("../components/login/Login")}>
      {({ pressed }) => (
        <FontAwesome
          name="sign-in"
          size={25}
          color={"black"}
          style={{ marginRight: 20, opacity: pressed ? 0.5 : 1 }}
        />
      )}
    </Pressable>
  );
}

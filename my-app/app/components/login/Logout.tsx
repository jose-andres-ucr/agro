import { Pressable, View, Text } from "react-native";

export default function Logout(props: { handler: () => void }) {
  return (
    <View>
      <Pressable onPress={() => props.handler()}>
        <Text>Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
}

import { router } from "expo-router";
import { View, Text } from "react-native";
import { CommentLog } from "./CommentLog";

export default function FixedVolumeMethod() {
  return (
    <View>
      <Text>Método del Volumen Fijo</Text>
      <CommentLog text='VolumeComments'/>
    </View>
  );
}

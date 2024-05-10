import { View, Text } from "react-native";
import { CommentLog } from "./CommentLog";

export default function PesticidePerArea() {
  return (
    <View>
      <Text>Marque un área conocida...</Text>
      <CommentLog text='PesticidePerAreaComments'/>
    </View>
  );
}

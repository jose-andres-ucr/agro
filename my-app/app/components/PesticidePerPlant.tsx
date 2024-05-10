import { View, Text } from "react-native";
import { CommentLog } from "./CommentLog";

export default function PesticidePerPlant() {
  return (
    <View>
      <Text>Cuente un número de plantas...</Text>
      <CommentLog text='PesticidePerPlantComments'/>
    </View>
  );
}

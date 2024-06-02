import { theme } from "@/constants/theme";
import { router } from "expo-router";
import { View, ScrollView } from "react-native";
import { Button, Card } from "react-native-paper";

export default function ManageUsers() {
  return (
    <ScrollView style={{ backgroundColor: "#FFF" }}>
      <View style={theme.screenContainer}>
        <Card
          style={{
            marginVertical: 20,
            borderColor: "gray",
            borderWidth: 1,
          }}
        >
          <Card.Title title="Seguridad y Control" />
          <Card.Content style={{ marginTop: 20 }}>
            <Button
              style={{ marginVertical: 15, padding: 8 }}
              mode="contained"
              onPress={() =>
                router.push("/components/managment/ApproveRegistration")
              }
            >
              Aprobaciones de Registro
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

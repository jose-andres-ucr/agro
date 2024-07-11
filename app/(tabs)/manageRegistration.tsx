import { View } from "react-native";
import { Card } from "react-native-paper";
import UserTable from "../components/management/UserTable";
import { theme } from "@/constants/theme";

export default function manageRegistration() {
  return (
    <View style={{ flex: 1, backgroundColor: "#FFF" }}>
      <Card
        style={{
          margin: 10,
          marginTop: 40,
          paddingBottom: 28,
          borderColor: "gray",
          borderWidth: 1,
        }}
      >
        <Card.Title
          title="Pendientes de revisión"
          style={{
            backgroundColor: theme.colors.primary,
            borderTopStartRadius: 10,
            borderTopEndRadius: 10,
          }}
        />

        <UserTable />
      </Card>
    </View>
  );
};

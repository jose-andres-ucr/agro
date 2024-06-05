import { View } from "react-native";
import { Card } from "react-native-paper";
import UserTable from "./UserTable";
import { theme } from "@/constants/theme";

const ApproveRegistration = () => {
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
          title="Aprobaciones de Registro Pendientes"
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

export default ApproveRegistration;

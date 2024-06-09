import { theme } from "@/constants/theme";
import * as React from "react";
import { View } from "react-native";
import { Divider, List, Text } from "react-native-paper";

const DropDownRole = ({
  handleRole,
}: {
  handleRole: (role: string) => void;
}) => {
  const [role, setRole] = React.useState("Seleccione el rol");
  const [expanded, setExpanded] = React.useState(false);
  const handlePress = (option: string) => {
    setRole(option);
    handleRole(option);
    setExpanded(!expanded);
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <List.Section
        title="Rol del Usuario"
        titleStyle={{ fontSize: 16, paddingLeft: 0 }}
        style={{ width: "80%", alignSelf: "center" }}
        focusable={true}
      >
        <List.Accordion
          title={role}
          left={(props) => <List.Icon {...props} icon="account" />}
          style={{
            borderColor:
              role === "Seleccione el rol" ? theme.colors.primary : "gray",
            borderWidth: 1,
          }}
          expanded={expanded}
          onPress={() => setExpanded(!expanded)}
        >
          <List.Item
            title="Estudiante"
            onPress={() => handlePress("Estudiante")}
          />
          <Divider />
          <List.Item title="Docente" onPress={() => handlePress("Docente")} />
          <Divider />
          <List.Item
            title="Usuario Externo"
            onPress={() => handlePress("Usuario Externo")}
          />
          <Divider />
        </List.Accordion>
      </List.Section>
      <Text style={{ alignSelf: "center" }}>
        Nota: Tanto docentes como usuarios externos
      </Text>
      <Text style={{ alignSelf: "center" }}>
        requieren validación posterior al registro.
      </Text>
    </View>
  );
};

export default DropDownRole;

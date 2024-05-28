import { theme } from "@/constants/theme";
import { View, ScrollView } from "react-native";
import { Button, Card } from "react-native-paper";

export default function ManageUsers() {
  return (
    <ScrollView>
      <View style={theme.screenContainer}>
        <Card
          style={{
            marginVertical: 20,
            borderColor: "gray",
            borderWidth: 1,
          }}
        >
          <Card.Title
            title="Base de Datos"
            style={{ backgroundColor: "#6dc067" }}
          />
          <Card.Title title="Usuarios y Grupos" />
          <Card.Content>
            <Button style={{ marginVertical: 15, padding: 8 }} mode="contained">
              Docentes
            </Button>
            <Button style={{ marginVertical: 15, padding: 8 }} mode="contained">
              Estudiantes
            </Button>
            <Button style={{ marginVertical: 15, padding: 8 }} mode="contained">
              Usuarios Externos
            </Button>
            <Button style={{ marginVertical: 15, padding: 8 }} mode="contained">
              Grupos
            </Button>
          </Card.Content>
        </Card>

        <Card
          style={{
            marginVertical: 20,
            borderColor: "gray",
            borderWidth: 1,
          }}
        >
          <Card.Title title="Gestión" style={{ backgroundColor: "#6dc067" }} />
          <Card.Title title="Seguridad y Control" />
          <Card.Content>
            <Button style={{ marginVertical: 15, padding: 8 }} mode="contained">
              Aprobaciones de Registro
            </Button>
            <Button style={{ marginVertical: 15, padding: 8 }} mode="contained">
              Control de Comentarios
            </Button>
            <Button style={{ marginVertical: 15, padding: 8 }} mode="contained">
              Cuentas no Verificadas
            </Button>
            <Button style={{ marginVertical: 15, padding: 8 }} mode="contained">
              Cuentas Deshabilitadas
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

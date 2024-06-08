import { theme } from "@/constants/theme";
import { useEffect, useState } from "react";
import { Button, Dialog, Divider, Portal, Text } from "react-native-paper";
import firestore from "@react-native-firebase/firestore";

type User = {
  id: string;
  FirstName: string;
  LastName: string;
  SecondLastName: string | null;
  Email: string;
  Role: string;
  Approved: number;
};

type propsType = {
  showModal: boolean;
  handleOnDismiss: () => void;
  user: User | null;
};

const ApproveModal = ({ showModal, handleOnDismiss, user }: propsType) => {
  const [fullname, setFullname] = useState("");

  useEffect(() => {
    if (user) {
      let name =
        user?.FirstName + " " + user?.LastName + " " + user?.SecondLastName;
      setFullname(name);
    }
  }, [user]);

  const handleAcceptRegistration = () => {
    firestore()
      .collection("Users")
      .doc(user?.id)
      .update({
        Approved: 1,
      })
      .then(() => {
        console.log("User approved!");
      })
      .catch((error: any) => {
        console.log(error.code);
      });
    handleOnDismiss();
  };

  const handleRejectRegistration = () => {
    firestore()
      .collection("Users")
      .doc(user?.id)
      .update({
        Approved: -1,
      })
      .then(() => {
        console.log("User rejected!");
      })
      .catch((error: any) => {
        console.log(error.code);
      });
    handleOnDismiss();
  };

  return (
    <Portal>
      <Dialog
        visible={showModal}
        onDismiss={handleOnDismiss}
        style={{ width: "95%", alignSelf: "center" }}
      >
        <Dialog.Title style={{ flexDirection: "row" }}>
          Información del usuario
        </Dialog.Title>
        <Dialog.Content>
          <Text style={{ fontSize: 18 }}>Rol: {user?.Role}</Text>
          <Divider style={{ marginVertical: 10 }} />
          <Text style={{ fontSize: 18 }}>Nombre: {fullname}</Text>
          <Divider style={{ marginVertical: 10 }} />
          <Text style={{ fontSize: 18 }}>Correo: {user?.Email}</Text>
          <Divider style={{ marginVertical: 20 }} />
          <Text
            style={{
              alignSelf: "center",
              fontSize: 20,
              marginTop: 10,
              marginBottom: 20,
            }}
          >
            Aprobar Registro
          </Text>
          <Dialog.Actions style={{ alignSelf: "center" }}>
            <Button
              mode="contained"
              style={{
                marginHorizontal: 5,
                paddingHorizontal: 20,
                paddingVertical: 5,
              }}
              labelStyle={{ fontSize: 18 }}
              buttonColor={theme.colors.secondary}
              onPress={handleAcceptRegistration}
            >
              Aceptar
            </Button>
            <Button
              mode="contained"
              style={{
                marginHorizontal: 5,
                paddingHorizontal: 20,
                paddingVertical: 5,
              }}
              labelStyle={{ fontSize: 18 }}
              buttonColor="red"
              onPress={handleRejectRegistration}
            >
              Rechazar
            </Button>
          </Dialog.Actions>
          <Divider style={{ marginVertical: 10 }} />
          <Button
            style={{ width: "40%", alignSelf: "center" }}
            labelStyle={{ fontSize: 22, fontWeight: "bold", paddingTop: 5 }}
            onPress={handleOnDismiss}
          >
            Cerrar
          </Button>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default ApproveModal;

import { router } from "expo-router";
import * as React from "react";
import { View } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";

type propsType = {
  checkEmail: boolean;
  userEmail: string | null | undefined;
};
const MyComponent = ({ checkEmail, userEmail }: propsType) => {
  return (
    <Portal>
      <Dialog visible={checkEmail}>
        <Dialog.Title>Verifique su correo electrónico</Dialog.Title>
        <Dialog.Content>
          <Text style={{ fontSize: 18 }}>
            Se ha enviado un correo de verificación a la dirección:
          </Text>
          <View style={{ marginVertical: 10 }} />
          <Text style={{ fontSize: 16 }}>{userEmail}</Text>
          <View style={{ marginVertical: 10 }} />
          <Text style={{ fontSize: 18 }}>
            Visite el vínculo para finalizar el registro.
          </Text>
          <View style={{ marginVertical: 10 }} />
          <Button onPress={() => router.back()}>Aceptar</Button>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default MyComponent;

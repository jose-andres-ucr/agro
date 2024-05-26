import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Modal, Pressable, View, Text, Alert, StyleSheet } from "react-native";

type propsType = {
  checkEmail: boolean;
  userEmail: string | null | undefined;
};

export default function CheckEmailModal({ checkEmail, userEmail }: propsType) {
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    setModalVisible(checkEmail);
  }, [checkEmail]);
  const handleClose = () => {
    setModalVisible(!modalVisible);
    router.back();
  };
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Se ha cerrado la ventana emergente");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Se ha enviado un correo de verificación a la dirección:
            </Text>
            <Text style={styles.emailText}>{userEmail}</Text>
            <Text style={styles.modalText}>
              Confirme el correo para finalizar el registro.
            </Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={handleClose}
            >
              <Text style={styles.textStyle}>Aceptar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 15,
    paddingHorizontal: 30,
    elevation: 2,
    marginTop: 15,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  modalText: {
    marginBottom: 25,
    textAlign: "center",
    fontSize: 20,
  },
  emailText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
});

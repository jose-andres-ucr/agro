import { useLocalSearchParams, useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import { Button } from 'react-native-paper';
import { UserContext } from "../../../hooks/context/UserContext";
import { useFetchGroups } from "../../../hooks/useFetchData";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

export default function ManageStudents() {
  const { userData } = useContext(UserContext);
  const groups = useFetchGroups(userData?.Role, userData?.Email);
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("ID del grupo:", id);
  }, [id]);

  const deleteGroup = async () => {
    if (typeof id !== 'string') {
      console.error('ID de grupo inválido.');
      return;
    }

    setLoading(true);
    try {
      const groupRef = firestore().collection('Groups').doc(id);

      const eduGroupMaterialSnapshot = await groupRef.collection('EduGroupMaterial').get();

      const deletePromises: Promise<void>[] = [];

      eduGroupMaterialSnapshot.forEach(async (doc) => {
        const data = doc.data();
        if (data.Attachment && data.Attachment.length > 0) {
          for (const attachmentUrl of data.Attachment) {
            const storageRef = storage().refFromURL(attachmentUrl);
            deletePromises.push(storageRef.delete());
          }
        }
        deletePromises.push(doc.ref.delete());
      });
      await Promise.all(deletePromises);

      await groupRef.delete();

      router.back();
      router.back();
    } catch (error) {
      console.error("Error eliminando el grupo: ", error);
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  const confirmDelete = () => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text
        style={{ fontSize: 20, textAlign: "center", marginBottom: 20 }}
      >
        ¿Eliminar el grupo {id}?
      </Text>
      <Button
        mode="contained"
        buttonColor="red"
        style={{
          width: "50%",
          alignSelf: "center",
          marginVertical: 30,
        }}
        labelStyle={{ fontSize: 16 }}
        onPress={confirmDelete}
        disabled={loading}
      >
        Eliminar Grupo
      </Button>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>¿Estás seguro de que deseas eliminar este grupo?</Text>
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                buttonColor="red"
                style={{
                  width: "50%",
                  alignSelf: "center",
                  marginVertical: 30,
                }}
                labelStyle={{ fontSize: 16 }}
                onPress={deleteGroup}
              >
                Sí
              </Button>
              <Button
                mode="contained"
                buttonColor="grey"
                style={{
                  width: "50%",
                  alignSelf: "center",
                  marginVertical: 30,
                }}
                labelStyle={{ fontSize: 16 }}
                onPress={() => setModalVisible(false)}
              >
                Cancelar
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

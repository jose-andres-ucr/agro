import { View, Text, ScrollView, TextInput, TouchableOpacity, Linking } from "react-native";
import { Button as FileBtn } from "react-native";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Dialog, Divider, Portal, Button } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/app/hooks/context/UserContext";
import { Controller, useForm } from 'react-hook-form';
import * as DocumentPicker from 'expo-document-picker';
import storage from '@react-native-firebase/storage';
import { theme } from "@/constants/theme";
import Sound from 'react-native-sound';
import { Image } from 'react-native';
import Video from 'react-native-video';
import getManageCommentsStyles from "@/constants/styles/ManageCommentsStyles"

type Reply = {
  id: string;
  Attachment: string[];
  Content: string,
  Date: FirebaseFirestoreTypes.Timestamp;
  User: string;
}

type ForumProps = {
  groupId: string;
  postId: string;
}

export default function Forum({groupId, postId }: ForumProps) {
  const { userData } = useContext(UserContext);
  const userName = userData?.FirstName+" "+userData?.LastName+" "+userData?.SecondLastName;
  const [replies, setReplies] = useState([] as Reply[]);
  const [selectedReply, setSelectedReply] = useState<Reply | null>(null);
  const [visible, setVisible] = useState(false);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [fileUris, setFileUris] = useState<string[]>([]);
  const { control, handleSubmit, reset, setValue } = useForm();
  const [editingReply, setEditingReply] = useState<Reply | null>(null);
  const [isPaused] = useState(true);
  const [audio, setAudio] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const styles = getManageCommentsStyles();

  useEffect(() => {
    const subscriber = firestore()
    .collection('Groups')
    .doc(groupId.toString())
    .collection('EduGroupMaterial')
    .doc(postId)
    .collection('ForumReplies')
    .orderBy('Date', 'desc')
    .onSnapshot(async (snapshot) => {
      const replies: Reply[] = [];
      for (const documentSnapshot of snapshot.docs) {
        const replyData = documentSnapshot.data() as Reply;
        replyData.id = documentSnapshot.id;
        replies.push(replyData);
      }
      setReplies(replies);
    });
    return () => subscriber();
  }, []);

  const addReply = async (data: any) => {
    try {
      console.log("Intento agregar", data, fileUris, userName, groupId, postId)
      const postRef = await firestore().collection('Groups')
      .doc(groupId.toString())
      .collection('EduGroupMaterial')
      .doc(postId)
      .collection('ForumReplies')
      .add({
        Attachment: [],
        Date: firestore.Timestamp.fromDate(new Date()),
        Content: data.Content,
        User: userName,
      });
      console.log("agregada")
      if (fileUris.length > 0) {
        await uploadFiles(fileUris, postRef.id);
        setFileUris([]);
      }
      reset();
    } catch (error) {
      console.error("Error agregando la respuesta: ", error);
    } 
    hideAddDialog();
  };
  
  const editReply = async (data: any) => {
    if (!editingReply) return;
    try {
      await firestore().collection('Groups')
      .doc(groupId.toString())
      .collection('EduGroupMaterial')
      .doc(postId)
      .collection('ForumReplies')
      .doc(editingReply.id)
      .update({
        Content: data.Content,
      });
      if (fileUris.length > 0) {
        await uploadFiles(fileUris, editingReply.id);
        setFileUris([]);
      }
      reset();
      setEditingReply(null);
    } catch (error) {
      console.error("Error editando la respuesta: ", error);
    }
    hideAddDialog();
  };

  const deleteReply = async (reply: Reply) => {
    try {
      const docRef = firestore().collection('Groups')
      .doc(groupId.toString())
      .collection('EduGroupMaterial')
      .doc(postId)
      .collection('ForumReplies')
      .doc(reply.id)
      const doc = await docRef.get();
  
      const attachmentUrls = doc.data()?.Attachment || [];
      const deleteTasks = attachmentUrls.map(async (url: string) => {
        const filename = url.substring(url.lastIndexOf('/') + 1, url.indexOf('?'));
        const storageRef = storage().ref().child(filename);
        await storageRef.delete();
      });

      await Promise.all(deleteTasks);
      await docRef.delete();
    } catch (error) {
      console.error("Error eliminando la respuesta del foro: ", error);
    }
    hideDialog();
  };

  const showAddDialog = () => {
    setVisible(true);
  };

  const hideAddDialog = () => {
    setVisible(false);
    setEditingReply(null);
    setValue('Content', "");
    setValue('Attachment', []);
  };

  const showDeleteDialog = (reply: Reply) => {
    setSelectedReply(reply);
    setVisibleDelete(true);
  };

  const hideDialog = () => {
    setVisibleDelete(false);
    setSelectedReply(null);
  };

  const handleEdit = (reply: Reply) => {
    setEditingReply(reply);
    setFileUris([]);
    setValue('Content', reply.Content);
    setValue('Attachment', reply.Attachment);
    setVisible(true);
  };

  const pickFile = async () => {
    try {
      const documentResult = await DocumentPicker.getDocumentAsync();
      const urifile = documentResult.assets![0];

      const fileUri = urifile.uri;
      const fileName = urifile.name;
      setFileUris(prevFileUris => [...prevFileUris, fileUri]);

    } catch (err) {
      console.error("Error picking file: ", err);
    }
  };

  const uploadFiles = async (uris: string[], replyId: string) => {
    try {
      const uploadTasks = uris.map(async (uri) => {
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = uri.replace('file://', '');
        const task = storage().ref(filename).putFile(uploadUri);
        await task;
        return storage().ref(filename).getDownloadURL();
      });

      const urls = await Promise.all(uploadTasks);
      await firestore().collection('Groups')
      .doc(groupId)
      .collection('EduGroupMaterial')
      .doc(postId)
      .collection('ForumReplies')
      .doc(replyId)
      .update({
        Attachment: urls,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView style={styles.repliesContainer}>
      <Text style={styles.replyContent}>Cantidad de respuestas: {replies.length}</Text>
      {replies.length > 0 ? (
        <>
        <Button style={styles.buttonPrimary} onPress={() => showAddDialog()}>
          <Text style={styles.buttonText}>Agregar respuesta</Text>
        </Button>
        <View style={styles.replyDivider}/>
        {replies.map((reply) => (
            <View style={styles.replyContainer}>
              <Text style={styles.replyAuthor}>{reply.User}:</Text>
              <Text style={styles.replyContent}>{reply.Content}</Text>
              {reply.Attachment && Array.isArray(reply.Attachment) ? (
          <>
            {reply.Attachment.map((attachment, attachmentIndex) => (
              <View key={attachmentIndex}>
                <Text style={styles.replyAttachment}>Archivos adjuntos:</Text>
                {typeof attachment === 'string' && attachment.startsWith('http') ? (
                  attachment.includes('.jpg') ? (
                    <Image source={{ uri: attachment }} style={{ width: 300, height: 300, marginBottom: 10 }} />
                  ) : attachment.includes('.mp4') ? (
                    <View>
                      <Video
                        source={{ uri: attachment }}
                        style={{ width: 360, height: 400, marginBottom: 10 }}
                        paused={isPaused}
                        controls={true}
                      />
                      <View style={styles.videoControls}>
                      </View>
                    </View>
                  ) : attachment.includes('.pdf') ? (
                    <TouchableOpacity onPress={() => Linking.openURL(attachment)}>
                      <Text style={[styles.postAttachment, { color: 'blue', textDecorationLine: 'underline' }]}>{attachment}</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.postAttachment}>Attachment: {attachment}</Text>
                  )
                ) : (
                  <Text style={styles.postAttachment}>Attachment: {attachment}</Text>
                )}
              </View>
            ))}
          </>
        ) : null}
            <Text style={styles.selectedReplyDate}>Fecha: {new Date(reply.Date.toDate()).toLocaleString()}</Text>
            <View style={{ flexDirection: "row",marginBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
              {userName === reply.User ? (
                <Button style={styles.confirmButton} onPress={() => handleEdit(reply)}>
                  <Text style={styles.buttonText}>Editar respuesta</Text>
                </Button>
              ) : null}
              {userData?.Role === "Docente" || userData?.Role === "Administrador" || userName === reply.User ? (
                <Button style={styles.deleteButton} onPress={() => showDeleteDialog(reply)}>
                  <Text style={styles.buttonText}>Eliminar respuesta</Text>
                </Button>
              ) : null}
            </View>
          </View>
          
          
        ))}
        <Text style={styles.end}>Fin de las respuestas</Text>
        </>
      ) : (
        <View>
          <Text style={styles.replyContent}>Aún no hay respuestas</Text>
          <Button style={styles.buttonPrimary} onPress={() => showAddDialog()}>
            <Text style={styles.buttonText}>Agregar respuesta</Text>
          </Button>
        </View>
      )}
      <Portal>
        <Dialog style={styles.modalBackground} visible={visible} onDismiss={hideAddDialog}>
          <Dialog.Title>{editingReply ? "Editar Respuesta" : "Agregar Respuesta"}</Dialog.Title>
          <Dialog.Content>
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Respuesta"
                    style={styles.inputComment}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="Content"
              />
                
              <FileBtn color={theme.colors.primary} title="Elegir Archivo" onPress={pickFile} />
              {fileUris && <Text>Archivo seleccionado: {fileUris.join(', ')}</Text>}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button style={styles.cancelButton} onPress={hideAddDialog}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </Button>
            <Button
              style={styles.confirmButton}
              onPress={handleSubmit(editingReply ? editReply : addReply)}
            >
              <Text style={styles.buttonText}>Confirmar</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog style={styles.modalBackground} visible={visibleDelete} onDismiss={hideDialog}>
          <Dialog.Title>Eliminar Respuesta</Dialog.Title>
          <Dialog.Content>
            <Text>¿Estás seguro de que deseas eliminar esta respuesta?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button style={styles.confirmButton} onPress={hideDialog}>
            <Text style={styles.buttonText}>Cancelar</Text>
            </Button>
            <Button style={styles.deleteButton}
              onPress={() => {
                if (selectedReply) {
                  deleteReply(selectedReply);
                }
              }}
            >
              <Text style={styles.buttonText}>Eliminar</Text>
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
    
  );
}
  
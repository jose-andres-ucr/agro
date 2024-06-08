import { Text, View, ScrollView, TouchableOpacity, Linking  } from "react-native";
import React, { useEffect, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Dialog, Divider, Portal, Button } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import Sound from 'react-native-sound';
import * as DocumentPicker  from 'expo-document-picker';
import storage from '@react-native-firebase/storage';
import { Image } from 'react-native';
import Video from 'react-native-video';
import getManageCommentsStyles from "@/constants/ManageCommentsStyles"

type Comment = {
  id?: string; // Agrega la propiedad id
  Attachment: string[];
  Name: string;
  DateTime: FirebaseFirestoreTypes.Timestamp;
  Comment: string;
  UserId: string; // incluir el UserId en el tipo Comment
  Response?: string; // Agrega el campo de respuesta
  Hide?: boolean;
}

export default function ManageComments() {
  const { collection, calculator } = useLocalSearchParams();
  const [comments, setComments] = useState([] as Comment[]);
  const [visible, setVisible] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [isPaused] = useState(true);
  const [audio, setAudio] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fileUris, setFileUris] = useState<string[]>([]);
  const styles = getManageCommentsStyles();

  useEffect(() => {
    const subscriber = firestore().collection(collection.toString()).onSnapshot((res) => {
      const comments = [] as Comment[];
      res.forEach((documentSnapshot) => {
        const commentData = documentSnapshot.data() as Comment;
        commentData.id = documentSnapshot.id;
        comments.push(commentData);
      });
      const sortComments = comments
        .slice()
        .sort((a, b) => b.DateTime.toMillis() - a.DateTime.toMillis())
      setComments(sortComments);
    });

    return () => subscriber();
  }, []);

  const deleteComment = async (comment: Comment) => {
    try {
      console.log(comment);
      await firestore().collection(collection.toString()).doc(comment?.id).delete();
      console.log('Comentario eliminado exitosamente.');
    } catch (error) {
      console.error("Error eliminando el comentario: ", error);
    }
    hideDialog();
  };

  const hideComment = async (comment: Comment) => {
    try {
      console.log(comment);
      await firestore()
        .collection(collection.toString())
        .doc(comment?.id)
        .update({
          Hide: true,
        });
      console.log('El valor Hide se ha actualizado a true.');
    } catch (error) {
      console.error('Error actualizando el valor Hide: ', error);
    }
  };

  const showComment = async (comment: Comment) => {
    try {
      console.log(comment);
      await firestore()
        .collection(collection.toString())
        .doc(comment?.id)
        .update({
          Hide: false,
        });
      console.log('El valor Hide se ha actualizado a false.');
    } catch (error) {
      console.error('Error actualizando el valor Hide: ', error);
    }
  };

  const showDeleteDialog = (comment: Comment) => {
    setSelectedComment(comment);
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setSelectedComment(null);
  };

  const playAudio = (uri: string) => {
    if (audio) {
      audio.stop(() => {
        audio.release();
      });
    }
  
    const sound = new Sound(uri, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('error al cargar sonido', error);
        return;
      }
      setAudio(sound);
      sound.play(() => {
        sound.release();
        setIsPlaying(false);
      });
    });
    setIsPlaying(true);
  };
  
  const stopAudio = () => {
    if (audio) {
      audio.stop(() => {
        audio.release();
        setAudio(null);
      });
      setIsPlaying(false);
    }
  };

  return (
    <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>Comentarios de {calculator}</Text>
          {comments.length === 0 ? (
            <Text style={styles.commentText}>Sin comentarios</Text>
          ) : (
            comments.map((comment, index) => (
              <View key={comment.id}>
                {comment.Name && comment.DateTime && comment.Comment ? (
                  <View style={styles.commentBox} key={comment.id}>
                    <View style={styles.commentContainer}>
                      <Text style={styles.commentName}>Nombre: {comment.Name}</Text>
                      <Text style={styles.commentDateTime}>Fecha y hora: {new Date(comment.DateTime.toDate()).toLocaleString()}</Text>
                      <Text style={styles.commentText}>Comentario: {comment.Comment}</Text>
                      {comment.Hide === true ? (
                        <Text style={styles.commentText}>Oculto para usuarios: sí</Text>
                      ): (
                        <Text style={styles.commentText}>Oculto para usuarios: no</Text>
                      )}
                    </View>

                      {Array.isArray(comment.Attachment) && comment.Attachment.map((attachment, attachmentIndex) => (
                        <View key={attachmentIndex} style={{ maxWidth: '100%', marginBottom: 10 }}>
                          {typeof attachment === 'string' && attachment.startsWith('http') ? (
                            attachment.includes('.jpg') ? (
                              <Image 
                                source={{ uri: attachment }} 
                                style={{ width: '100%', aspectRatio: 1, marginBottom: 10 }} 
                                resizeMode="contain"
                              />
                            ) : attachment.includes('.mp4') ? (
                              <View style={{ maxWidth: '100%' }}>
                                <Video 
                                  source={{ uri: attachment }} 
                                  style={{ width: '100%', aspectRatio: 16/9, marginBottom: 10 }} 
                                  paused={isPaused}
                                  controls={true} 
                                />
                                <View style={styles.videoControls}></View>
                              </View>
                            ) : attachment.includes('.mp3') || attachment.includes('.wav') ? (
                              <View>
                                {isPlaying ? (
                                  <TouchableOpacity onPress={stopAudio} style={{ backgroundColor: 'red', padding: 10, borderRadius: 5 }}>
                                    <Text style={{ color: 'white', textAlign: 'center' }}>Stop</Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity onPress={() => playAudio(attachment)} style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5 }}>
                                    <Text style={{ color: 'white', textAlign: 'center', textDecorationLine: 'underline' }}>Play</Text>
                                  </TouchableOpacity>
                                )}
                              </View>

                            ) : attachment.includes('.pdf') ? (
                              <TouchableOpacity onPress={() => Linking.openURL(attachment)}>
                                <View style={styles.horizontalLine}></View>
                                <Text style={styles.selectedPostDescription}> Adjuntos:</Text>
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

                    {comment.Response ? (
                      <View style={styles.commentContainer}>
                        <Text style={styles.response}>Respuestas</Text>
                        <Text style={styles.commentResponse}>Respuesta: {comment.Response}</Text>
                      </View>
                    ):null}
                    <View style={styles.commentSeparator}/>
                    <View style={styles.row}>
                      {comment.Hide === true ? (
                        <Button style={styles.button} onPress={() => showComment(comment)}>
                          <Text style={styles.buttonText}>Volver a mostrar</Text>
                        </Button>
                      ):(
                        <Button style={styles.button} onPress={() => hideComment(comment)}>
                          <Text style={styles.buttonText}>Ocultar</Text>
                        </Button>
                      )}
                      <Button style={styles.deleteButton} onPress={() => showDeleteDialog(comment)}>
                        <Text style={styles.buttonText}>Eliminar</Text>
                      </Button>
                    </View>
                  </View>
                ):null}
              </View>
            ))
          )}
        </View>
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Eliminar Comentario</Dialog.Title>
          <Dialog.Content>
            <Text>¿Estás seguro de que deseas eliminar este comentario?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button style={styles.button} onPress={hideDialog}>
            <Text style={styles.buttonText}>Cancelar</Text>
            </Button>
            <Button style={styles.deleteButton}
              onPress={() => {
                if (selectedComment) {
                  deleteComment(selectedComment);
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
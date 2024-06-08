import { Button, Text, View, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Linking } from "react-native";
import React, { useEffect, useMemo, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { useFetchUserData } from "../../hooks/FetchData";
import auth from "@react-native-firebase/auth";
import * as DocumentPicker  from 'expo-document-picker';
import storage from '@react-native-firebase/storage';
import { Image } from 'react-native';
import Video from 'react-native-video';
import styles from '../styles';
import Sound from 'react-native-sound';


type Comment = {
  id?: string; // Agrega la propiedad id
  Attachment: string[];
  Name: string;
  DateTime: FirebaseFirestoreTypes.Timestamp;
  Comment: string;
  UserId: string; // incluir el UserId en el tipo Comment
  Response?: string; // Agrega el campo de respuesta
}

export const CommentLog = (props: { text: string, userId: string }) => {
  const [comments, setComments] = useState([] as Comment[]);
  const [showResponse, setShowResponse] = useState<number | null>(null); // Estado para controlar la visibilidad de la respuesta
  const [commentPosted, setCommentPosted] = useState(false); // Estado para controlar la visibilidad del mensaje
  const { control, handleSubmit, reset } = useForm<Comment>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userAuth, userData } = useFetchUserData();
  const [fileUris, setFileUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPaused] = useState(true);
  const [audio, setAudio] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    const subscriber = firestore()
      .collection(props.text)
      .orderBy('DateTime', 'desc')
      .onSnapshot((res) => {
        const comments = [] as Comment[];
        res.forEach((documentSnapshot) => {
          const data = documentSnapshot.data() as Comment;
          const id = documentSnapshot.id;
          comments.push({...data, id});
        });
        setComments(comments);
      });

    return () => subscriber();
  }, []);

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

  const uploadFiles = async (uris: string[], postId: string) => {
    try {
      const uploadTasks = uris.map(async (uri) => {
        const filename = uri.substring(uri.lastIndexOf('/') + 1);
        const uploadUri = uri.replace('file://', '');
        const task = storage().ref(filename).putFile(uploadUri);
        await task;
        return storage().ref(filename).getDownloadURL();
      });

      const urls = await Promise.all(uploadTasks);

      await firestore().collection(props.text).doc(postId).update({
        Attachment: urls,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const addComment: SubmitHandler<Comment> = async (data) => {
    setIsSubmitting(true);
    try {
      const comment: Comment = {
        Attachment: [],
        Name: data.Name,
        DateTime: firestore.Timestamp.fromDate(new Date()),
        Comment: data.Comment,
        UserId: props.userId }

      const postRef = await firestore().collection(props.text).add(comment);
      reset();

      if (fileUris.length > 0) {
        await uploadFiles(fileUris, postRef.id);
        setFileUris([]);
      }

      setCommentPosted(true);
      setTimeout(() => setCommentPosted(false), 3000); // Ocultar el mensaje después de 3 segundos
      
    } catch (error) {
      console.error("Error agregando el comentario: ", error);
    } finally {
      setIsSubmitting(false);
    }
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

  const addResponse = async (data: { Response: string }, commentId: string | undefined) => {
    if(!commentId){
      return;
    }
    try {
      if (!data.Response) {
        console.error("La respuesta no puede estar vacía.");
        return;
      }
      
      await firestore().collection(props.text).doc(commentId).update({
        Response: data.Response
      });
      reset();
    } catch (error) {
      console.error("Error agregando la respuesta: ", error);
    }
  };

  const filteredComments = useMemo(() => (comments
    .slice()
    .sort((a, b) => b.DateTime.toMillis() - a.DateTime.toMillis())), [comments]);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      <View style={styles.container}>
        <View style={{ alignItems: 'flex-start' }}>
        </View>
        <View>
          <View style={styles.separator} />
          {userAuth && userData && (
            <>
              <Text style={styles.title}>Nuevo comentario</Text>
              <View>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Nombre"
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={auth().currentUser?.displayName || ""}
                      keyboardType="default"
                      editable={false}
                    />
                  )}
                  name="Name"
                  defaultValue={auth().currentUser?.displayName || ""}
                />
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder="Comentario"
                      style={styles.inputComment}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      keyboardType="default"
                      multiline={true}
                    />
                  )}
                  name="Comment"
                />
                <Button title="Elegir Archivo" onPress={pickFile} />
                {fileUris && <Text>Archivo seleccionado: {fileUris.join(', ')}</Text>}
                {loading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                  <Button onPress={handleSubmit(addComment)} title="Enviar" />
                )}
                {isSubmitting && <ActivityIndicator size="large" color="steelblue" />}
              </View>
            </>
          )}
          <Text style={styles.title}>Comentarios</Text>
          {filteredComments.length === 0 ? (
            <Text style={stylesLocal.commentText}>Sin comentarios</Text>
          ) : (
            filteredComments.map((comment, index) => (
              <View id ={comment.id}>
                {comment.Name && comment.DateTime && comment.Comment ? (
                  <View style={stylesLocal.commentBox} id={comment.id}>
                    <View style={stylesLocal.commentContainer}>
                      <Text style={stylesLocal.commentName}>{comment.Name}</Text>
                      <Text style={stylesLocal.commentDateTime}>{new Date(comment.DateTime.toDate()).toLocaleString()}</Text>
                      <Text style={stylesLocal.commentText}>{comment.Comment}</Text>
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
                    </View>
                    {comment.Response ? (
                      <View style={stylesLocal.commentContainer}>
                        <Text style={stylesLocal.title}>Respuestas</Text>
                        <Text style={stylesLocal.commentResponse}>Respuesta: {comment.Response}</Text>
                      </View>
                    ) : (
                      <View style={stylesLocal.commentContainer}>
                        <Text style={stylesLocal.commentResponse}>
                          <Button onPress={() => setShowResponse(index)} title="Responder" />
                        </Text>
                        {showResponse === index && (
                          <View>
                            <Controller
                              control={control}
                              render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                  placeholder="Respuesta"
                                  style={styles.input}
                                  onBlur={onBlur}
                                  onChangeText={onChange}
                                  value={value}
                                  keyboardType="default"
                                />
                              )}
                              name="Response"
                            />
                            <Button onPress={handleSubmit((data) => {
                              if (data.Response) {
                                addResponse({ Response: data.Response }, comment?.id)
                              } else {
                                console.error("El valor de Response está indefinido.");
                              }
                            })} title="Enviar respuesta" />
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                ) : null}
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const stylesLocal = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'steelblue',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '100%',
    backgroundColor: 'steelblue',
  },
  commentBox: {
    marginBottom: 10,
    borderWidth: 3,
    borderRadius: 15,
    borderColor: 'lightsteelblue',
    alignSelf: 'stretch',
  },
  commentContainer: {
    padding: 10,
  },
  commentName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentDateTime: {
    fontStyle: 'italic',
  },
  commentText: {
    marginBottom: 10,
  },
  commentResponse: {
    marginTop: 10,
    color: 'green', // Agregar estilo para el color verde
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  inputComment: {
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
  },
});

import { Button, Text, View, StyleSheet, ScrollView, TextInput, ActivityIndicator, TouchableOpacity, Linking } from "react-native";
import React, { useEffect, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Controller, useForm } from 'react-hook-form';
import { useFetchUserData } from "../../hooks/FetchData";
import auth from "@react-native-firebase/auth";
import * as DocumentPicker  from 'expo-document-picker';
import storage from '@react-native-firebase/storage';
import { Image } from 'react-native';
import Video, {VideoRef} from 'react-native-video';
import styles from '../styles';
import Sound from 'react-native-sound';


type Comment = {
  id: string;
  Attachment: string[];
  Name: string;
  DateTime: FirebaseFirestoreTypes.Timestamp;
  Comment: string;
}

export const CommentLog = (props: { text: string }) => {
  const [comments, setComments] = useState([] as Comment[]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { control, handleSubmit, reset } = useForm();
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
        res.forEach((documentSnapshot) => comments.push(documentSnapshot.data() as Comment));
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
        console.log(uploadUri);
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

  const addComment = async (data: any) => {
    setIsSubmitting(true);
    try {
      const postRef = await firestore().collection(props.text).add({
        Attachment: [],
        Name: data.Name,
        DateTime: firestore.Timestamp.fromDate(new Date()),
        Comment: data.Comment
      });
      reset();

      if (fileUris.length > 0) {
        await uploadFiles(fileUris, postRef.id);
        setFileUris([]);
      }

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
        console.log('failed to load the sound', error);
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
          {comments.map((comment, index) => (
            <View key={index}>
              <View style={stylesLocal.commentBox} key={index}>
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
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

}

const stylesLocal = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 20,
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
    marginBottom: 5,
    color: 'gray',
  },
  commentText: {
    lineHeight: 20,
  },
  input: {
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  inputComment: {
    width: '100%',
    height: 200,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlignVertical: "top"
  },
});

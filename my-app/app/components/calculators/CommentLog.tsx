import { Button, Text, View, StyleSheet, ScrollView, TextInput, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Controller, useForm } from 'react-hook-form';
import { useFetchUserData } from "../../hooks/FetchData";
import auth from "@react-native-firebase/auth";

type Comment = {
  Name: string;
  DateTime: FirebaseFirestoreTypes.Timestamp;
  Comment: string;
}

export const CommentLog = (props: { text: string }) => {
  const [comments, setComments] = useState([] as Comment[]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para manejar el feedback de carga
  const { control, handleSubmit, reset } = useForm();
  const { userAuth, userData } = useFetchUserData();

  useEffect(() => {
    const subscriber = firestore().collection(props.text).onSnapshot((res) => {
      const comments = [] as Comment[];
      res.forEach((documentSnapshot) => comments.push(documentSnapshot.data() as Comment));
      setComments(comments);
    });

    return () => subscriber();
  }, []);

  const addComment = async (data: any) => {
    setIsSubmitting(true);
    try {
      await firestore().collection(props.text).add({
        Name: data.Name,
        DateTime: firestore.Timestamp.fromDate(new Date()),
        Comment: data.Comment
      });
      reset();
    } catch (error) {
      console.error("Error agregando el comentario: ", error);
    } finally {
      setIsSubmitting(false);
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
                {isSubmitting ? (
                  <ActivityIndicator size="large" color="steelblue" />
                ) : (
                  <Button onPress={handleSubmit(addComment)} title="Enviar" />
                )}
              </View>
            </>
          )}
          <Text style={styles.title}>Comentarios</Text>
          {comments.map((comment, index) => (
            <View key={index}>
              <View style={styles.commentBox} key={index}>
                <View style={styles.commentContainer}>
                  <Text style={styles.commentName}>{comment.Name}</Text>
                  <Text style={styles.commentDateTime}>{new Date(comment.DateTime.toDate()).toLocaleString()}</Text>
                  <Text style={styles.commentText}>{comment.Comment}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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

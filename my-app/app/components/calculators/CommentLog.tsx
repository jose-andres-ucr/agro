import { Button, Text, View, StyleSheet, ScrollView, TextInput } from "react-native";
import React, { useEffect, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Controller, useForm } from 'react-hook-form';


type Comment = {
  Name: string;
  DateTime: FirebaseFirestoreTypes.Timestamp;
  Comment: string;
}

export const CommentLog = (props: { text: string }) => {
  const [comments, setComments] = useState([] as Comment[]);
  const [showComments, setShowComments] = useState(false);
  const { control, handleSubmit, reset } = useForm();
  
  useEffect(() => {
    const subscriber = firestore().collection(props.text).onSnapshot((res) => {
      const comments = [] as Comment[];
      res.forEach((documentSnapshot) => comments.push(documentSnapshot.data() as Comment));
      setComments(comments);
    });

  return () => subscriber();
  }, []);

  const addComment = async (data:any) => {
    try {
      await firestore().collection(props.text).add({
        Name: data.Name,
        DateTime: firestore.Timestamp.fromDate(new Date()),
        Comment: data.Comment
      });
      reset();
    } catch (error) {
      console.error("Error agregando el comentario: ", error);
    }
  };

  return (
    <ScrollView
    contentContainerStyle={{ flexGrow: 1 }}
    ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      <View style={styles.container}>
        <View style={{alignItems: 'flex-start'}}>
        <Button
          title={showComments ? "Ocultar comentarios" : "Mostrar comentarios"}
          onPress={() => setShowComments(!showComments)}
        />
        </View>
        {showComments && (
          <View>
            <View style={styles.separator} />
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
                      value={value}
                      keyboardType="default"
                    />
                  )}
                  name="Name"
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
                <Button onPress={handleSubmit(addComment)} title="Enviar" />
              </View>
            <Text style={styles.title}>Comentarios</Text>
            {comments.map((comment, index) => (
              <View key={index}>
              {comment.Name && comment.DateTime && comment.Comment ? (
                <>
                  <View style={styles.commentBox} key={index}>
                    <View style={styles.commentContainer}>
                      <Text style={styles.commentName}>Nombre: {comment.Name}</Text>
                      <Text style={styles.commentDateTime}>Fecha y hora: {new Date(comment.DateTime.toDate()).toLocaleString()}</Text>
                      <Text style={styles.commentText}>Comentario: {comment.Comment}</Text>
                    </View>
                  </View>
                </>
              ) : null}
              </View>
            ))}
          </View>
        )}
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
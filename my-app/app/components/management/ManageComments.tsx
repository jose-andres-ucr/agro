import { Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Dialog, Divider, Portal, Button } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import getCommentsStyles from "@/constants/CommentsStyles"

type Comment = {
  id: string; // Agrega la propiedad id
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
  const styles = getCommentsStyles();

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
                      <Button style={styles.deleteButton} onPress={() => deleteComment(comment)}>
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
    </ScrollView>
  );
}
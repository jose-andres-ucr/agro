import { Button, Text, View, StyleSheet } from "react-native";
import React, { useEffect, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';


type Comment = {
  Name: string;
  DateTime: FirebaseFirestoreTypes.Timestamp;
  Comment: string;
}

export const CommentLog = (props: { text: string }) => {
  const [comments, setComments] = useState([] as Comment[]);
  const [showComments, setShowComments] = useState(false);
  
  useEffect(() => {
    const subscriber = firestore().collection(props.text).onSnapshot((res) => {
      const comments = [] as Comment[];
      res.forEach((documentSnapshot) => comments.push(documentSnapshot.data() as Comment));
      setComments(comments);
    });

  return () => subscriber();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comentarios</Text>
      <View style={styles.separator} />
      {showComments && (
        <View>
          {comments.map((comment, index) => (
            <View style={styles.container} key ={index}>
              <Text>Nombre: {comment.Name}</Text>
              <Text>Fecha y hora: {new Date(comment.DateTime.toDate()).toLocaleString()}</Text>
              <Text>Comentario: {comment.Comment}</Text>
            </View>
          ))}
        </View>
      )}
      <Button
        title={showComments ? "Ocultar comentarios" : "Mostrar comentarios"}
        onPress={() => setShowComments(!showComments)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

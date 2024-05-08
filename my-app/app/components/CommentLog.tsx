import { Text, View, StyleSheet } from "react-native";
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';


type Comment = {
  Name: string;
  Comment: string;
}

export const CommentLog = () => {
  const [comments, setComments] = useState([] as Comment[]);
  
  useEffect(() => {
    const subscriber = firestore().collection('VelocityComments').onSnapshot((res) => {
      const comments = [] as Comment[];
      res.forEach((documentSnapshot) => comments.push(documentSnapshot.data() as Comment));
      setComments(comments);
    });

  return () => subscriber();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Estudiantes</Text>
      <View style={styles.separator} />
      <View>
        {comments.map((comment, index) => (
          <View style={styles.container} key ={index}>
            <Text>Nombre: {comment.Name}</Text>
            <Text>Comentario: {comment.Comment}</Text>
          </View>
        ))}
      </View>
    </View>
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

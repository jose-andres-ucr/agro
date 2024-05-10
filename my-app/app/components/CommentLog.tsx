import { Button, Text, View, StyleSheet } from "react-native";
import React, { useEffect, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { ScrollView } from 'react-native';


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
            <Text style={styles.title}>Comentarios</Text>
            {comments.map((comment, index) => (
              <View>
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
});
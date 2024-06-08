import { Button, Text, View, StyleSheet, ScrollView, TextInput } from "react-native";
import React, { useEffect, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import useUserRole from '../../hooks/UserRole'; // Importa el hook para obtener el rol del usuario
import { getUniqueUserId } from '../../hooks/UserUtils'; // Ruta al archivo UserUtils.js

type Comment = {
  id: string; // Agrega la propiedad id
  Name: string;
  DateTime: FirebaseFirestoreTypes.Timestamp;
  Comment: string;
  UserId: string; // incluir el UserId en el tipo Comment
  Response?: string; // Agrega el campo de respuesta
}

type CommentFormData = {
  Name: string;
  Comment: string;
  Response?: string;
}

export const CommentLog = (props: { text: string }) => {
  const { userRole, userId: loggedUserId } = useUserRole(); //rol y el ID del usuario
  const [comments, setComments] = useState([] as Comment[]);
  const [showComments, setShowComments] = useState(false);
  const [showResponse, setShowResponse] = useState<number | null>(null); // Estado para controlar la visibilidad de la respuesta
  const [commentPosted, setCommentPosted] = useState(false); // Estado para controlar la visibilidad del mensaje
  const { control, handleSubmit, reset } = useForm<CommentFormData>();
  const [userId, setUserId] = useState('');

  // Asignar id única a un usuario no logueado
  useEffect(() => {
    const fetchUserId = async () => {
      if (userRole !== 'Administrador' && userRole !== 'Docente') {
        const id = await getUniqueUserId();
        setUserId(id);
      } else {
        setUserId(''); // Asignar una cadena vacía para los administradores y docentes
      }
    };
  
    fetchUserId();
  }, [userRole]);

  useEffect(() => {
    const subscriber = firestore().collection(props.text).onSnapshot((res) => {
      const comments = [] as Comment[];
      res.forEach((documentSnapshot) => {
        const commentData = documentSnapshot.data() as Comment;
        commentData.id = documentSnapshot.id;
        comments.push(commentData);
      });
      setComments(comments);
    });

    return () => subscriber();
  }, []);

  const addComment: SubmitHandler<CommentFormData> = async (data) => {
    try {
      await firestore().collection(props.text).add({
        Name: data.Name,
        DateTime: firestore.Timestamp.fromDate(new Date()),
        Comment: data.Comment,
        UserId: userRole ? loggedUserId : userId  // Agrega el ID del usuario al comentario
      });
      reset();
      setCommentPosted(true);
      setTimeout(() => setCommentPosted(false), 3000); // Ocultar el mensaje después de 3 segundos
    } catch (error) {
      console.error("Error agregando el comentario: ", error);
    }
  };

  const addResponse = async (data: { Response: string }, commentId: string) => {
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

  const filteredComments = comments
  .slice()
  .sort((a, b) => b.DateTime.toMillis() - a.DateTime.toMillis())
  .filter(comment => {
    if (userRole === 'Administrador' || userRole === 'Docente') {
      return true; // Admins pueden ver todos los comentarios
    }
    return comment.UserId === (userRole ? loggedUserId : userId);
  });

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      ref={(scrollView) => { scrollView?.scrollToEnd({ animated: true }); }}
    >
      <View style={styles.container}>
        <View style={{ alignItems: 'flex-start' }}>
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
              {commentPosted && <Text style={styles.successMessage}>Comentario publicado</Text>}
            </View>
            <Text style={styles.title}>Comentarios</Text>
            {filteredComments.length === 0 ? (
              <Text style={styles.commentText}>Sin comentarios</Text>
            ) : (
              filteredComments.map((comment, index) => (
                <View key={comment.id}>
                  {comment.Name && comment.DateTime && comment.Comment ? (
                    <View style={styles.commentBox} key={comment.id}>
                      <View style={styles.commentContainer}>
                        <Text style={styles.commentName}>Nombre: {comment.Name}</Text>
                        <Text style={styles.commentDateTime}>Fecha y hora: {new Date(comment.DateTime.toDate()).toLocaleString()}</Text>
                        <Text style={styles.commentText}>Comentario: {comment.Comment}</Text>
                      </View>
                      {comment.Response ? (
                        <View style={styles.commentContainer}>
                          <Text style={styles.title}>Respuestas</Text>
                          <Text style={styles.commentResponse}>Respuesta: {comment.Response}</Text>
                        </View>
                      ) : (
                        <View style={styles.commentContainer}>
                          <Text style={styles.commentResponse}>
                            {(userRole === 'Administrador' || userRole === 'Docente') && (
                              <Button onPress={() => setShowResponse(index)} title="Responder" />
                            )}
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
                                  addResponse({ Response: data.Response }, comment.id)
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
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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








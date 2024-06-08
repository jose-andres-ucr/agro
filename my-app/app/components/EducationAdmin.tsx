import React, { useEffect, useState } from 'react';
import { Button, Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Linking, Alert, ActivityIndicator, Pressable } from "react-native";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Keyboard } from 'react-native';
import * as DocumentPicker  from 'expo-document-picker';
import Video, {VideoRef} from 'react-native-video';
import { MaterialIcons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';
import storage from '@react-native-firebase/storage';
import { Controller } from 'react-hook-form';
import styles from './styles';

type Post = {
  id: string;
  Attachment: string[];
  Date: FirebaseFirestoreTypes.Timestamp;
  Description: string;
  Title: string;
  User: string;
}

const POSTS_PER_PAGE = 4;

const EducationalMaterial = () => {
  const [posts, setPosts] = useState([] as Post[]);
  const [originalPosts, setOriginalPosts] = useState([] as Post[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [fileUris, setFileUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset, setValue } = useForm();
  const [isPaused] = useState(true);

  useEffect(() => {
    const subscriber = firestore().collection('EducationalMaterial')
      .orderBy('Date', 'desc')
      .onSnapshot((res) => {
        const posts = [] as Post[];
        res.forEach((documentSnapshot) => {
          const postData = documentSnapshot.data() as Post;
          postData.id = documentSnapshot.id;
          posts.push(postData);
        });
        setPosts(posts);
        setOriginalPosts(posts); // Guardar los datos originales
        setTotalPages(Math.ceil(posts.length / POSTS_PER_PAGE));
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
  
        await firestore().collection('EducationalMaterial').doc(postId).update({
          Attachment: urls,
        });
      } catch (e) {
        console.error(e);
      }
    };
  
    const addPost = async (data: any) => {
      setLoading(true); // Start loading
      try {
        const postRef = await firestore().collection('EducationalMaterial').add({
          Attachment: [],
          Date: firestore.Timestamp.fromDate(new Date()),
          Description: data.Description,
          Title: data.Title,
          User: data.User,
        });
  
        if (fileUris.length > 0) {
          await uploadFiles(fileUris, postRef.id);
          setFileUris([]);
        }
  
        reset();
      } catch (error) {
        console.error("Error agregando el post: ", error);
      } finally {
        setLoading(false);
      }
    };
  
    const editPost = async (data: any) => {
      if (!editingPost) return;
      setLoading(true); // Start loading
      try {
        await firestore().collection('EducationalMaterial').doc(editingPost.id).update({
          Description: data.Description,
          Title: data.Title,
          User: data.User
        });
  
        if (fileUris.length > 0) {
          await uploadFiles(fileUris, editingPost.id);
          setFileUris([]);
        }
  
        reset();
        setEditingPost(null);
      } catch (error) {
        console.error("Error editando el post: ", error);
      } finally {
        setLoading(false);
      }
    };
  
    const deletePost = async (postId: string) => {
      try {
        await firestore().collection('EducationalMaterial').doc(postId).delete();
      } catch (error) {
        console.error("Error deleting the post: ", error);
      }
    };
  
    const confirmDelete = (postId: string) => {
      Alert.alert(
        "Borrar publicación",
        "¿Está seguro de que quiere eliminar esta publicación?",
        [
          {
            text: "Cancelar",
            style: "cancel"
          },
          {
            text: "Eliminar",
            onPress: () => deletePost(postId)
          }
        ],
        { cancelable: false }
      );
    };
  
    const handleEdit = (post: Post) => {
      setShowNewPostForm(true);
      setEditingPost(post);
      setFileUris([]);
      setValue('Title', post.Title);
      setValue('Description', post.Description);
      setValue('User', post.User);
      setValue('Attachment', post.Attachment);
    };


  const renderPosts = () => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
  
    const truncateDescription = (description: string) => {
      if (description.length > 100) {
        return description.substring(0, 100) + '...';
      }
      return description;
    };
  
    return posts.slice(start, end).map((post, index) => (
      <TouchableOpacity key={index} onPress={() => setSelectedPost(post)}>
        <View style={styles.postContainer}>
          <Text style={styles.postTitle}>{post.Title}</Text>
          <Text style={styles.postDescription}>{truncateDescription(post.Description)}</Text>
          <Text style={styles.postAutorDate}>Autor: {post.User}  |  Fecha: {new Date(post.Date.toDate()).toLocaleDateString()}  |  Ver más</Text>
        </View>
        <View style={styles.horizontalLine}></View>
        <Button title="Editar" onPress={() => handleEdit(post)} />
        <Button title="Eliminar" onPress={() => confirmDelete(post.id)} />    
      </TouchableOpacity>
    ));
  };

  const renderPostDetails = () => {
    if (selectedPost) {
      return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.postDetailscontainer}>
            <View style={styles.titleAndButtonContainer}>
              {/* Botón "Volver" como ícono de flecha */}
              <TouchableOpacity onPress={() => setSelectedPost(null)}>
                <MaterialIcons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
              {/* Título centrado horizontalmente */}
              <Text style={styles.selectedPostTitle}>{selectedPost.Title}</Text>
            </View>
            <Text style={styles.selectedPostDescription}>{selectedPost.Description}</Text>
            <Text style={styles.selectedPostAutorDate}>Autor: {selectedPost.User}  |  Fecha: {new Date(selectedPost.Date.toDate()).toLocaleDateString()} </Text>
            {selectedPost.Attachment && Array.isArray(selectedPost.Attachment) ? (
              <>
                {selectedPost.Attachment.map((attachment, attachmentIndex) => (
                  <View key={attachmentIndex}>
                    {typeof attachment === 'string' && attachment.startsWith('http') ? (
                      attachment.includes('.jpg') ? (
                        <Image source={{ uri: attachment }} style={{ width: 300, height: 300, marginBottom: 10 }} />
                      ) : attachment.includes('.mp4') ? (
                        <View>
                          <Video 
                            source={{ uri: attachment }} 
                            style={{ width: 360, height: 400, marginBottom: 10}} 
                            paused={isPaused}
                            controls={true} 
                          />
                          <View style={styles.videoControls}>
           
                          </View>
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
              </>
            ) : null}
          </View>
        </ScrollView>
      );
    }
    return null;
  };

  const handleSearch = () => {
    let filteredPosts;
    if (searchQuery && searchQuery.trim() !== '') {
      filteredPosts = originalPosts.filter(post => {
        return post.Title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    } else {
      // Si la búsqueda está vacía, mostrar todas las publicaciones originales
      filteredPosts = originalPosts;
    }
    Keyboard.dismiss();

    // Actualizar los posts mostrados y la cantidad total de páginas según los posts filtrados
    setPosts(filteredPosts);
    setTotalPages(Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  };

  return (
    <>
      {selectedPost ? renderPostDetails() : (
        <View style={styles.container}>
          <Button
          title={showNewPostForm ? "Ocultar formulario" : "Mostrar formulario"}
          onPress={() => setShowNewPostForm(!showNewPostForm)}
        />
        {showNewPostForm && (
          <>
            <View style={styles.separator} />
            <Text style={styles.title}>{editingPost ? "Editar Post" : "Nuevo Post"}</Text>
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Título"
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="Title"
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Descripción"
                    style={styles.inputComment}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    multiline={true}
                  />
                )}
                name="Description"
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="Usuario"
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="User"
              />
              <Button title="Elegir Archivo" onPress={pickFile} />
              {fileUris && <Text>Archivo seleccionado: {fileUris.join(', ')}</Text>}
              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <Button onPress={handleSubmit(editingPost ? editPost : addPost)} title={editingPost ? "Guardar cambios" : "Enviar"} />
              )}
              {editingPost && <Button onPress={() => setEditingPost(null)} title="Cancelar" />}
            </View>
          </>
        )}


          <Text style={styles.title}>Últimas entradas</Text>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por título..."
              onChangeText={(text) => setSearchQuery(text)}
              value={searchQuery}
            />
            <Button title="Buscar" onPress={handleSearch} />
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {renderPosts()}
          </ScrollView>
          <View style={styles.pagination}>
            <TouchableOpacity
              onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <Text style={[styles.pageButton, currentPage === 1 && styles.disabled]}>Anterior</Text>
            </TouchableOpacity>
            <Text style={styles.pageNumber}>{`${currentPage} / ${totalPages}`}</Text>
            <TouchableOpacity
              onPress={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <Text style={[styles.pageButton, currentPage === totalPages && styles.disabled]}>Siguiente</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}


export default EducationalMaterial;
import React, { useEffect, useState } from 'react';
import { Button, Text, View, ScrollView, TextInput, TouchableOpacity, Image, Linking, Alert, ActivityIndicator } from "react-native";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Keyboard, Switch } from 'react-native';
import Video from 'react-native-video';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import getManageEducationStyles from '@/constants/styles/ManageEducationStyles';
import { Controller, useForm } from 'react-hook-form';
import * as DocumentPicker from 'expo-document-picker';
import storage from '@react-native-firebase/storage';
import { useLocalSearchParams } from 'expo-router';
import auth from "@react-native-firebase/auth";
import Forum from '../../forum/Forum';

type Post = {
  id: string;
  Attachment: string[];
  Date: FirebaseFirestoreTypes.Timestamp;
  Description: string;
  Title: string;
  User: string;
  Forum?: boolean;
}

type RenderPostsProps = {
  posts: Post[];
  styles: any;
  currentPage: number;
  totalPages: number;
  handlePageChange: (action: 'prev' | 'next') => void;
  setSelectedPost: (post: Post | null) => void;
  showNewPostForm: boolean;
  setShowNewPostForm: React.Dispatch<React.SetStateAction<boolean>>;
  editingPost: Post | null;
  setEditingPost: React.Dispatch<React.SetStateAction<Post | null>>;
  fileUris: string[];
  setFileUris: React.Dispatch<React.SetStateAction<string[]>>;
  control: any;
  handleSubmit: any;
  reset: any;
  setValue: any;
};

const POSTS_PER_PAGE = 4;

const RenderPosts: React.FC<RenderPostsProps> = ({
  posts,
  styles,
  currentPage,
  totalPages,
  handlePageChange,
  setSelectedPost,
  setShowNewPostForm,
  setEditingPost,
  setFileUris,
  setValue,
}) => {
  const truncateDescription = (description: string) => {
    if (description.length > 100) {
      return description.substring(0, 100) + '...';
    }
    return description;
  };

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;
  const { id } = useLocalSearchParams();

  const handleEdit = (post: Post) => {
    setShowNewPostForm(true);
    setEditingPost(post);
    setFileUris([]);
    setValue('Title', post.Title);
    setValue('Description', post.Description);
    setValue('User', post.User);
    setValue('Attachment', post.Attachment);
  };

  const deletePost = async (postId: string) => {
    try {
      const docRef = firestore().collection('Groups')
      .doc(id.toString())
      .collection('EduGroupMaterial')
      .doc(postId);
      const doc = await docRef.get();
  
      const attachmentUrls = doc.data()?.Attachment || [];
      const deleteTasks = attachmentUrls.map(async (url: string) => {
        const filename = url.substring(url.lastIndexOf('/') + 1, url.indexOf('?'));
        const storageRef = storage().ref().child(filename);
        await storageRef.delete();
      });

      await Promise.all(deleteTasks);
      await docRef.delete();
    } catch (error) {
      console.error("Error deleting the post and attachments: ", error);
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

  return (
    <>
      {posts.slice(start, end).map((post: Post, index: number) => (
        <TouchableOpacity key={index} onPress={() => setSelectedPost(post)}>
          <View style={styles.postContainer}>
            <Text style={styles.postTitle}>{post.Forum ? "FORO: " : ""}{post.Title}</Text>
            <Text style={styles.postDescription}>{truncateDescription(post.Description)}</Text>
            <Text style={styles.postAutorDate}>Autor: {post.User}  |  Fecha: {new Date(post.Date.toDate()).toLocaleDateString()}  |  Ver más</Text>
          </View>
          <View style={styles.horizontalLine}></View>
          <Button color={theme.colors.primary} title="Editar" onPress={() => handleEdit(post)} />
          <Button color={theme.colors.primary} title="Eliminar" onPress={() => confirmDelete(post.id)} />
        </TouchableOpacity>
      ))}
      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => handlePageChange('prev')}
          disabled={currentPage === 1}
        >
          <Text style={[styles.pageButton, currentPage === 1 && styles.disabled]}>Anterior</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumber}>{`${currentPage} / ${totalPages}`}</Text>
        <TouchableOpacity
          onPress={() => handlePageChange('next')}
          disabled={currentPage === totalPages}
        >
          <Text style={[styles.pageButton, currentPage === totalPages && styles.disabled]}>Siguiente</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

type RenderPostDetailsProps = {
  selectedPost: Post;
  styles: any;
  setSelectedPost: (post: Post | null) => void;
};

const RenderPostDetails: React.FC<RenderPostDetailsProps> = ({ selectedPost, styles, setSelectedPost }) => {
  const { id } = useLocalSearchParams();
  const isPaused = true;

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.postDetailscontainer}>
        <View style={styles.titleAndButtonContainer}>
          <TouchableOpacity onPress={() => setSelectedPost(null)}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.selectedPostTitle}>{selectedPost.Forum ? "FORO: " : ""}{selectedPost.Title}</Text>
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
                        style={{ width: 360, height: 400, marginBottom: 10 }}
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
        {selectedPost.Forum ? 
        <View>
          <Text style={styles.selectedForumTitle}>Respuestas del foro:</Text>
          <Forum groupId={id.toString()} postId={selectedPost.id} />
        </View>
         : null}

      </View>
    </ScrollView>
  );
};

const EducationalMaterial = () => {
  const { id } = useLocalSearchParams();
  const styles = getManageEducationStyles();
  const [posts, setPosts] = useState([] as Post[]);
  const [originalPosts, setOriginalPosts] = useState([] as Post[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [fileUris, setFileUris] = useState<string[]>([]);
  const { control, handleSubmit, reset, setValue } = useForm();
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const subscriber = firestore()
    .collection('Groups')
    .doc(id.toString())
    .collection('EduGroupMaterial')
    .orderBy('Date', 'desc')
    .onSnapshot(async (snapshot) => {
      const posts: Post[] = [];
      for (const documentSnapshot of snapshot.docs) {
        const postData = documentSnapshot.data() as Post;
        postData.id = documentSnapshot.id;
        posts.push(postData);
      }
      setPosts(posts);
      setOriginalPosts(posts);
      setTotalPages(Math.ceil(posts.length / POSTS_PER_PAGE));
    });

  return () => subscriber();

  }, []);

  const handlePageChange = (action: 'prev' | 'next') => {
    if (action === 'prev') {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
    } else {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }
  };

  const handleSearch = () => {
    let filteredPosts;
    if (searchQuery && searchQuery.trim() !== '') {
      filteredPosts = originalPosts.filter(post => {
        return post.Title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    } else {
      filteredPosts = originalPosts;
    }
    Keyboard.dismiss();
    setPosts(filteredPosts);
    setTotalPages(Math.ceil(filteredPosts.length / POSTS_PER_PAGE));
  };

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

  const addPost = async (data: any) => {
    setLoading(true); 
    try {
      console.log("AQUIII", id)
      const postRef = await firestore().collection('Groups')
      .doc(id.toString())
      .collection('EduGroupMaterial')
      .add({
        Attachment: [],
        Date: firestore.Timestamp.fromDate(new Date()),
        Description: data.Description,
        Title: data.Title,
        User: auth().currentUser?.displayName,
        Forum: data.Forum,
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
    setLoading(true); 
    try {
      await firestore().collection('Groups')
      .doc(id.toString())
      .collection('EduGroupMaterial').doc(editingPost.id).update({
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

      await firestore().collection('Groups')
      .doc(id.toString())
      .collection('EduGroupMaterial').doc(postId).update({
        Attachment: urls,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      {selectedPost ? (
        <RenderPostDetails selectedPost={selectedPost} styles={styles} setSelectedPost={setSelectedPost} />
      ) : (
        <View style={styles.container}>
          <Button color={theme.colors.primary}
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
                      value={auth().currentUser?.displayName || ""}
                      editable={false}
                    />
                  )}
                  name="User"
                  defaultValue={auth().currentUser?.displayName || ""}
                />
                {editingPost ? null : 
                <View style={styles.switchContainer}>
                  <Text>Foro:</Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <Switch
                        onValueChange={(val) => onChange(val)}
                        value={value}
                      />
                    )}
                    name="Forum"
                    defaultValue = {false}
                  />
                </View>}
                
                <Button color={theme.colors.primary} title="Elegir Archivo" onPress={pickFile} />
                {fileUris && <Text>Archivo seleccionado: {fileUris.join(', ')}</Text>}
                {loading ? (
                  <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                  <Button color={theme.colors.primary} onPress={handleSubmit(editingPost ? editPost : addPost)} title={editingPost ? "Guardar cambios" : "Enviar"} />
                )}
                {editingPost && <Button color={theme.colors.primary} onPress={() => setEditingPost(null)} title="Cancelar" />}
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
            <Button color={theme.colors.primary} title="Buscar" onPress={handleSearch} />
          </View>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <RenderPosts
              posts={posts}
              styles={styles}
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageChange={handlePageChange}
              setSelectedPost={setSelectedPost}
              showNewPostForm={showNewPostForm}
              setShowNewPostForm={setShowNewPostForm}
              editingPost={editingPost}
              setEditingPost={setEditingPost}
              fileUris={fileUris}
              setFileUris={setFileUris}
              control={control}
              handleSubmit={handleSubmit}
              reset={reset}
              setValue={setValue}
            />
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default EducationalMaterial;
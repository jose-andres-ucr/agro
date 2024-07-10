import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState, useContext } from 'react';
//import { Button } from "react-native-paper";
import { theme } from "@/constants/theme";
import {  Button, Text, View, ScrollView, TextInput, TouchableOpacity, Image, Linking } from "react-native";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Keyboard } from 'react-native';
import Video from 'react-native-video';
import { MaterialIcons } from '@expo/vector-icons';
import getEducationStyles from "@/constants/styles/EducationStyles";
import { UserContext } from "@/app/hooks/context/UserContext";
import Forum from "../forum/Forum"

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
};

const POSTS_PER_PAGE = 4;

const RenderPosts: React.FC<RenderPostsProps> = ({ posts, styles, currentPage, totalPages, handlePageChange, setSelectedPost }) => {
  const truncateDescription = (description: string) => {
    if (description.length > 100) {
      return description.substring(0, 100) + '...';
    }
    return description;
  };

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

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

export default function GroupInformation() {
  const { id } = useLocalSearchParams();
  const { userData} = useContext(UserContext);

  const styles = getEducationStyles();
  const [posts, setPosts] = useState([] as Post[]);
  const [originalPosts, setOriginalPosts] = useState([] as Post[]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

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
      setOriginalPosts(posts); // Guardar los datos originales
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

  useEffect(() => {
    console.log("ID del grupo:", id );
  }, [id]);

  return (
    <>
      {selectedPost ? (
        <RenderPostDetails selectedPost={selectedPost} styles={styles} setSelectedPost={setSelectedPost} />
      ) : (
        <View style={styles.container}>
          {userData?.Role === "Docente" || userData?.Role === "Administrador" ? (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 10 }}>
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.primary,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                flex: 1,
                marginRight: 10,
              }}
              onPress={() => router.push(`../management/manageEducationalMaterial/${id}`)}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Administrar Material</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: theme.colors.primary,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
                flex: 1,
                marginLeft: 10,
              }}
              onPress={() => router.push(`../management/manageGroupStudents/${id}`)}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Lista Estudiantes</Text>
            </TouchableOpacity>
          </View>
          ) : null}

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
            />
          </ScrollView>
          {userData?.Role === "Docente" || userData?.Role === "Administrador" ? (
          <View style={{ marginBottom: 10, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
            }}
            onPress={() => router.push(`../management/deleteGroup/${id}`)}
          >
            <Text style={{ color: 'white' }}>Eliminar Grupo</Text>
          </TouchableOpacity>
        </View>
        ) : null}
        </View>
      )}
    </>
  );
}

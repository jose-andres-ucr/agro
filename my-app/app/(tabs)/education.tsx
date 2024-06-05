import React, { useEffect, useState } from 'react';
import { Button, Text, View, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Linking } from "react-native";
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Keyboard } from 'react-native';
import Video from 'react-native-video';
import { MaterialIcons } from '@expo/vector-icons';

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

  // Mostrar todos los posts
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
      </TouchableOpacity>
    ));
  };

  // Mostrar los detalles de un post
  const renderPostDetails = () => {
    if (selectedPost) {
      return (
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.postDetailscontainer}>
            <View style={styles.titleAndButtonContainer}>
              <TouchableOpacity onPress={() => setSelectedPost(null)}>
                <MaterialIcons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>
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
  
  // Manejar la barra de busqueda
  const handleSearch = () => {
    let filteredPosts;
    if (searchQuery && searchQuery.trim() !== '') {
      //  Si la búsqueda no está vacía, mostrar todas las publicaciones filtradas
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

//  Estilos
const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  container: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    flex: 1,
  },
  postDetailscontainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    flex: 1,
  },
  titleAndButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    color: 'steelblue',
    alignSelf: 'center',
  },
  postContainer: {
    padding: 10,
  },
  postTitle: {
    marginBottom: 5,
    fontSize: 16,
  },
  postAutorDate: {
    marginBottom: 5,
    color: 'gray',
  },
  postDescription: {
    lineHeight: 22,
    marginBottom: 5,
    fontSize: 14,
  },
  selectedPostTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    color: 'steelblue',
    alignSelf: 'center',
    flex: 1, 
    textAlign: 'center', 
  },
  selectedPostAutorDate: {
    marginBottom: 25,
    color: 'gray',
  },
  selectedPostDescription: {
    lineHeight: 22,
    marginBottom: 20,
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  pageButton: {
    fontSize: 14,
    color: 'blue',
  },
  pageNumber: {
    fontSize: 16,
  },
  disabled: {
    color: 'gray',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#F7F7F7',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  horizontalLine: {
    borderBottomColor: 'black', 
    borderBottomWidth: 0.5,
    marginVertical: 10, 
  },
  postAttachment: {
    color: 'blue',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default EducationalMaterial;
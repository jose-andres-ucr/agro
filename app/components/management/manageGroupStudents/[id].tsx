import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import { showToastError, showToastSuccess } from '@/constants/utils';
import LoadingButton from '../../LoadingButton';

interface Student {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export default function ManageStudents() {
  const params = useLocalSearchParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [matchingStudents, setMatchingStudents] = useState<Student[] | null>(null);
  const [showMatches, setShowMatches] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (!id) throw new Error('Group ID is required');
        
        const groupDoc = await firestore().collection('Groups').doc(id).get();
        const studentRefs = groupDoc.data()?.students || [];
        const studentPromises = studentRefs.map((ref: FirebaseFirestoreTypes.DocumentReference) => ref.get());
        const studentDocs = await Promise.all(studentPromises);
        const studentData = studentDocs.map((doc) => ({
          id: doc.id,
          email: doc.data().Email,
          firstName: doc.data().FirstName,
          lastName: doc.data().LastName,
        } as Student));
        setStudents(studentData);
      } catch (error) {
        console.log(error);
        showToastError('Error', 'Error al obtener estudiantes');
      }
    };

    fetchStudents();
  }, [id]);

  useEffect(() => {
    const fetchMatchingStudents = async () => {
      if (newStudentEmail.length === 0) {
        setMatchingStudents(null);
        return;
      }

      const studentQuery = await firestore().collection('Users')
        .where('Email', '>=', newStudentEmail)
        .where('Email', '<=', newStudentEmail + '\uf8ff')
        .limit(5)
        .get();
      
      const studentData = studentQuery.docs.map(doc => ({
        id: doc.id,
        email: doc.data().Email,
        firstName: doc.data().FirstName,
        lastName: doc.data().LastName,
      }));
      setMatchingStudents(studentData);
    };

    fetchMatchingStudents();
  }, [newStudentEmail]);

  const handleAddStudent = async () => {
    setLoading(true);
    try {
      const studentQuery = await firestore().collection('Users').where('Email', '==', newStudentEmail).get();
      if (studentQuery.empty) {
        showToastError('Error', 'No se encontró el estudiante con ese correo electrónico');
        setLoading(false);
        return;
      }

      const studentDoc = studentQuery.docs[0];
      const studentRef = studentDoc.ref;

      // Validar si el estudiante ya está en el grupo
      const groupDoc = await firestore().collection('Groups').doc(id).get();
      const studentRefs = groupDoc.data()?.students || [];
      if (studentRefs.some((ref: FirebaseFirestoreTypes.DocumentReference) => ref.id === studentRef.id)) {
        showToastError('Error', 'El estudiante ya está en el grupo');
        setLoading(false);
        return;
      }

      // Agregar referencia del estudiante al grupo
      await firestore().collection('Groups').doc(id).update({
        students: firestore.FieldValue.arrayUnion(studentRef)
      });

      // Agregar ID del grupo al estudiante
      await studentRef.update({
        groupIds: firestore.FieldValue.arrayUnion(id)
      });

      setStudents((prevStudents) => [...prevStudents, {
        id: studentDoc.id,
        email: studentDoc.data().Email,
        firstName: studentDoc.data().FirstName,
        lastName: studentDoc.data().LastName,
      } as Student]);
      showToastSuccess('Éxito', 'Estudiante agregado correctamente');
      setNewStudentEmail('');
      setShowMatches(true); // Reset to allow autocomplete again
    } catch (error) {
      console.log(error);
      showToastError('Error', 'Error al agregar estudiante');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveStudent = async (studentEmail: string) => {
    setLoading(true);
    try {
      const studentQuery = await firestore().collection('Users').where('Email', '==', studentEmail).get();
      if (studentQuery.empty) {
        showToastError('Error', 'No se encontró el estudiante con ese correo electrónico');
        setLoading(false);
        return;
      }
      const studentDoc = studentQuery.docs[0];
      const studentRef = studentDoc.ref;

      // Remover referencia del estudiante del grupo
      await firestore().collection('Groups').doc(id).update({
        students: firestore.FieldValue.arrayRemove(studentRef)
      });

      // Remover ID del grupo del estudiante
      await studentRef.update({
        groupIds: firestore.FieldValue.arrayRemove(id)
      });

      setStudents((prevStudents) => prevStudents.filter((student) => student.email !== studentEmail));
      showToastSuccess('Éxito', 'Estudiante eliminado correctamente');
    } catch (error) {
      console.log(error);
      showToastError('Error', 'Error al eliminar estudiante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20, backgroundColor: '#f5f5f5', flex: 1 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 20, textAlign: 'center' }}>
        Lista de Estudiantes Matriculados en el grupo {id}
      </Text>
      <FlatList
        data={students}
        keyExtractor={(student) => student.id}
        ListHeaderComponent={() => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text style={{ fontWeight: 'bold', width: '40%', textAlign: 'left' }}>Correo Estudiante</Text>
            <Text style={{ fontWeight: 'bold', width: '40%', textAlign: 'left' }}>Nombre Estudiante</Text>
            <Text style={{ fontWeight: 'bold', width: '20%', textAlign: 'center' }}></Text>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
            <Text style={{ width: '40%', textAlign: 'left', flexWrap: 'wrap' }}>{item.email}</Text>
            <Text style={{ width: '40%', textAlign: 'left', marginLeft: 10 }}>{item.firstName} {item.lastName}</Text>
            <Pressable onPress={() => handleRemoveStudent(item.email)} style={{ width: '20%', alignItems: 'center' }}>
              <Text style={{ color: 'red' }}>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
  
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginVertical: 20, textAlign: 'center' }}>Agregar Estudiante</Text>
      <TextInput
        placeholder="Correo del estudiante"
        value={newStudentEmail}
        onChangeText={(text) => {
          setNewStudentEmail(text);
          setShowMatches(true); // Reset to allow autocomplete again
        }}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          marginVertical: 10,
          borderRadius: 20,
          width: '80%',
          alignSelf: 'center',
          backgroundColor: '#fff'
        }}
      />
      {showMatches && matchingStudents ? (
        <View style={{ width: '80%', alignSelf: 'center', backgroundColor: '#fff', borderRadius: 10, overflow: 'hidden' }}>
          <FlatList
            data={matchingStudents}
            keyExtractor={(student) => student.id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setNewStudentEmail(item.email);
                  setShowMatches(false);
                }}
                style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}
              >
                <Text>{item.email}</Text>
              </Pressable>
            )}
            keyboardShouldPersistTaps="always"
          />
        </View>
      ) : null}
      <LoadingButton
        label="Agregar Estudiante"
        isLoading={loading}
        handlePress={handleAddStudent}
      />
    </View>
  );
  
  
  
}

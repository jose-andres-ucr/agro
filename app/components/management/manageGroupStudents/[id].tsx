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
    <View>
      <Text>Lista de Estudiantes Matriculados en el grupo {id}</Text>
      <FlatList
        data={students}
        keyExtractor={(student) => student.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 }}>
            <Text>{item.email}</Text>
            <Text>{item.firstName} {item.lastName}</Text>
            <Pressable onPress={() => handleRemoveStudent(item.email)}>
              <Text style={{ color: 'red' }}>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />

      <Text>Agregar Estudiante</Text>
      <TextInput
        placeholder="Correo del estudiante"
        value={newStudentEmail}
        onChangeText={setNewStudentEmail}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <LoadingButton
        label="Agregar Estudiante"
        isLoading={loading}
        handlePress={handleAddStudent}
      />
    </View>
  );
}

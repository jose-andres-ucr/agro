import { useFetchTeachers } from "@/app/hooks/useFetchData";
import { theme } from "@/constants/theme";
import { useEffect, useState } from "react";
import { View, StyleSheet, Pressable, Image } from "react-native";
import { FlatList } from "react-native";
import { TextInput, Text } from "react-native-paper";
import LoadingButton from "../LoadingButton";
import firestore from "@react-native-firebase/firestore";
import { router } from "expo-router";

type User = {
  id: string;
  FirstName: string;
  LastName: string;
  SecondLastName: string | null;
  Email: string;
  Role: string;
  Approved: number;
  Verified: number;
};

export default function CreateGroup() {
  const teachers: User[] = useFetchTeachers();
  const [groupNumber, setGroupNumber] = useState(0);
  const [semester, setSemester] = useState(0);
  const [year, setYear] = useState(0);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [matchingTeachers, setMatchingTeachers] = useState<User[] | null>(null);
  const [showMatches, setShowMatches] = useState(true);
  const [chosenCover, setChosenCover] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      showMatches === false &&
      teacherEmail.endsWith("@ucr.ac.cr") === false
    ) {
      setShowMatches(true);
    }

    if (teacherEmail !== "") {
      let match: User[] = teachers
        .filter((teacher) => teacher.Email.startsWith(teacherEmail))
        .slice(0, 5);
      setMatchingTeachers(match);
    } else {
      setMatchingTeachers(null);
    }
  }, [showMatches, teacherEmail]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const groupId =
        semester +
        "-S-" +
        year +
        "-" +
        teacherEmail.split("@")[0] +
        "-" +
        groupNumber.toString().padStart(3, "0");
      const newGroup = {
        GroupNumber: groupNumber,
        Semester: semester,
        Year: year,
        TeacherEmail: teacherEmail,
        Cover: chosenCover,
      };
      await firestore().collection("Groups").doc(groupId).set(newGroup);
      router.back();
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={theme.screenContainer}>
      <TextInput
        mode="outlined"
        label="Número de grupo"
        onChangeText={(number) => setGroupNumber(parseInt(number))}
        keyboardType="numeric"
        autoCapitalize="none"
        autoComplete="cc-number"
        returnKeyType="next"
        blurOnSubmit={false}
        style={{ marginBottom: 5 }}
      />

      <TextInput
        mode="outlined"
        label="Semestre"
        onChangeText={(number) => setSemester(parseInt(number))}
        keyboardType="numeric"
        autoCapitalize="none"
        autoComplete="cc-number"
        returnKeyType="next"
        blurOnSubmit={false}
        style={{ marginBottom: 5 }}
      />
      <TextInput
        mode="outlined"
        label="Año"
        onChangeText={(number) => setYear(parseInt(number))}
        keyboardType="numeric"
        autoCapitalize="none"
        autoComplete="cc-exp-year"
        returnKeyType="next"
        blurOnSubmit={false}
        style={{ marginBottom: 5 }}
      />
      <TextInput
        mode="outlined"
        label="Correo Institucional del Docente"
        onChangeText={setTeacherEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="cc-exp-year"
        value={teacherEmail}
        returnKeyType="next"
        blurOnSubmit={false}
        style={{ marginBottom: 5 }}
      />
      {showMatches ? (
        <View>
          <FlatList
            data={matchingTeachers}
            keyExtractor={(teacher) => teacher.id}
            renderItem={(item) => (
              <Pressable
                onPress={() => {
                  setTeacherEmail(item.item.Email);
                  setShowMatches(false);
                }}
              >
                <Text>{item.item.Email}</Text>
              </Pressable>
            )}
          />
        </View>
      ) : null}
      <Text style={{ fontSize: 16, marginTop: 40 }}>Seleccione un fondo:</Text>
      <View style={{ flexDirection: "row" }}>
        <Pressable onPress={() => setChosenCover(0)}>
          <Image
            source={require("../../../assets/images/cover1.jpg")}
            style={{
              width: 170,
              height: 100,
              margin: 10,
              marginLeft: 0,
              borderWidth: chosenCover === 0 ? 3 : 0,
              borderColor: chosenCover === 0 ? theme.colors.primary : "white",
            }}
          />
        </Pressable>
        <Pressable onPress={() => setChosenCover(1)}>
          <Image
            source={require("../../../assets/images/cover2.jpg")}
            style={{
              width: 170,
              height: 100,
              margin: 10,
              marginLeft: 0,
              borderWidth: chosenCover === 1 ? 3 : 0,
              borderColor: chosenCover === 1 ? theme.colors.primary : "white",
            }}
          />
        </Pressable>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Pressable onPress={() => setChosenCover(2)}>
          <Image
            source={require("../../../assets/images/cover3.jpg")}
            style={{
              width: 170,
              height: 100,
              margin: 10,
              marginLeft: 0,
              borderWidth: chosenCover === 2 ? 3 : 0,
              borderColor: chosenCover === 2 ? theme.colors.primary : "white",
            }}
          />
        </Pressable>
        <Pressable onPress={() => setChosenCover(3)}>
          <Image
            source={require("../../../assets/images/cover4.jpg")}
            style={{
              width: 170,
              height: 100,
              margin: 10,
              marginLeft: 0,
              borderWidth: chosenCover === 3 ? 3 : 0,
              borderColor: chosenCover === 3 ? theme.colors.primary : "white",
            }}
          />
        </Pressable>
      </View>

      <LoadingButton
        label="Crear Grupo"
        isLoading={loading}
        handlePress={handleSubmit}
      />
    </View>
  );
}

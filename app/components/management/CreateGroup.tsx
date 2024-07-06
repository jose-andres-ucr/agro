import { useFetchGroups, useFetchTeachers } from "@/app/hooks/useFetchData";
import { theme } from "@/constants/theme";
import { useContext, useEffect, useState } from "react";
import { View, Pressable, Image, Keyboard } from "react-native";
import { FlatList } from "react-native";
import { TextInput, Text, SegmentedButtons } from "react-native-paper";
import LoadingButton from "../LoadingButton";
import firestore from "@react-native-firebase/firestore";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput as TextInputRn } from "react-native";
import { showToastError } from "@/constants/utils";
import { UserContext } from "../../hooks/context/UserContext";

const form = z.object({
  GroupNumber: z
    .number({ message: "Se esperaba un valor numérico" })
    .positive({ message: "El grupo debe ser un valor positivo" })
    .int({ message: "El grupo debe ser un valor entero" }),
  Year: z
    .number({ message: "Se esperaba un valor numérico" })
    .positive({ message: "El año debe ser un valor positivo" })
    .int({ message: "El año debe ser un valor entero" }),
  TeacherEmail: z.string({ message: "Este campo es requerido" }),
});
type FormData = z.infer<typeof form>;

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

type Group = {
  id: string;
  GroupNumber: number;
  Semester: string;
  Year: number;
  TeacherEmail: string;
  Cover: number;
};

const covers = [
  require("../../../assets/images/cover1.jpg"),
  require("../../../assets/images/cover2.jpg"),
  require("../../../assets/images/cover3.jpg"),
  require("../../../assets/images/cover4.jpg"),
];

export default function CreateGroup() {
  const { userData } = useContext(UserContext);
  const teachers: User[] = useFetchTeachers();
  const groups: Group[] = useFetchGroups(userData?.Role, userData?.Email);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [semester, setSemester] = useState("I");
  const [matchingTeachers, setMatchingTeachers] = useState<User[] | null>(null);
  const [showMatches, setShowMatches] = useState(true);
  const [chosenCover, setChosenCover] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm({
    defaultValues: {
      GroupNumber: 0,
      Year: 0,
      TeacherEmail: "",
    },
    resolver: zodResolver(form),
  });

  useEffect(() => {
    if (errors) {
      if (errors.GroupNumber) {
        showToastError("Número de grupo", errors.GroupNumber.message);
      } else if (errors.TeacherEmail) {
        showToastError("Correo del Docente", errors.TeacherEmail.message);
      } else if (errors.Year) {
        showToastError("Año", errors.Year.message);
      }
    }
  }, [errors]);

  const refs = {
    GroupNumber: React.useRef<TextInputRn>(null),
    Year: React.useRef<TextInputRn>(null),
    TeacherEmail: React.useRef<TextInputRn>(null),
  } as const;

  useEffect(() => {
    setValue("TeacherEmail", teacherEmail);
    if (
      showMatches === false &&
      teacherEmail.endsWith("@ucr.ac.cr") === false
    ) {
      setShowMatches(true);
    }

    if (teacherEmail !== "") {
      if (teachers.find((t) => t.Email === teacherEmail)) {
        setShowMatches(false);
      } else {
        let match: User[] = teachers
          .filter((teacher) =>
            teacher.Email.startsWith(teacherEmail.toLowerCase())
          )
          .slice(0, 3);
        setMatchingTeachers(match);
      }
    } else {
      setMatchingTeachers(null);
    }
  }, [showMatches, teacherEmail]);

  const onSubmit = async (form: FormData) => {
    clearErrors();
    setLoading(true);
    try {
      const groupId =
        semester +
        "-S-" +
        form.Year +
        "-" +
        teacherEmail.split("@")[0] +
        "-" +
        form.GroupNumber.toString().padStart(3, "0");
      const newGroup = {
        GroupNumber: form.GroupNumber,
        Semester: semester,
        Year: form.Year,
        TeacherEmail: form.TeacherEmail,
        Cover: chosenCover,
      };
      //let group = await firestore().collection("Groups").doc(groupId).get();
      let groupExists = groups.find(
        (g) =>
          g.GroupNumber === newGroup.GroupNumber &&
          g.Year === newGroup.Year &&
          g.Semester === newGroup.Semester
      );
      if (groupExists) {
        showToastError("Número de grupo", "El grupo ya existe");
        throw new Error("El grupo ya existe");
      }
      let emailExists = teachers.find((t) => t.Email === newGroup.TeacherEmail);
      if (!emailExists) {
        showToastError(
          "Correo del docente",
          "El correo electrónico no pertenece a un docente"
        );
        throw new Error("El correo electrónico no pertenece a un docente");
      }

      await firestore().collection("Groups").doc(groupId).set(newGroup);
      router.back();
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={theme.screenContainer}>
      <Controller
        control={control}
        render={({ field: { onChange } }) => (
          <TextInput
            ref={refs.GroupNumber}
            mode="outlined"
            label="Número de grupo"
            onChangeText={(number) => onChange(parseInt(number))}
            keyboardType="numeric"
            autoCapitalize="none"
            autoComplete="cc-exp-year"
            inputMode="numeric"
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => refs.TeacherEmail.current?.focus()}
            style={{ marginBottom: 10 }}
          />
        )}
        name="GroupNumber"
      />

      <Controller
        control={control}
        render={() => (
          <TextInput
            ref={refs.TeacherEmail}
            mode="outlined"
            label="Correo Institucional del Docente"
            onChangeText={setTeacherEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="cc-exp-year"
            value={teacherEmail}
            returnKeyType="next"
            blurOnSubmit={false}
            onSubmitEditing={() => refs.Year.current?.focus()}
            style={{ marginBottom: 0 }}
          />
        )}
        name="TeacherEmail"
      />
      {showMatches ? (
        <View style={{ marginBottom: 10 }}>
          <FlatList
            data={matchingTeachers}
            keyExtractor={(teacher) => teacher.id}
            renderItem={(item) => (
              <Pressable
                onPress={() => {
                  setTeacherEmail(item.item.Email);
                  setShowMatches(false);
                }}
                style={{
                  paddingVertical: 5,
                  backgroundColor: theme.colors.primary,
                }}
              >
                <Text style={{ paddingLeft: 15 }}>{item.item.Email}</Text>
              </Pressable>
            )}
            keyboardShouldPersistTaps="always"
          />
        </View>
      ) : null}

      <Controller
        control={control}
        render={({ field: { onChange } }) => (
          <TextInput
            ref={refs.Year}
            mode="outlined"
            label="Año"
            onChangeText={(number) => onChange(parseInt(number))}
            keyboardType="numeric"
            autoCapitalize="none"
            autoComplete="cc-exp-year"
            inputMode="numeric"
            returnKeyType="done"
            blurOnSubmit={false}
            onSubmitEditing={() => Keyboard.dismiss()}
            style={{ marginBottom: 15 }}
          />
        )}
        name="Year"
      />

      <SegmentedButtons
        value={semester}
        onValueChange={(value) => {
          setSemester(value);
          Keyboard.dismiss();
        }}
        buttons={[
          {
            value: "I",
            label: "I Semestre",
          },
          {
            value: "II",
            label: "II Semestre",
          },
          {
            value: "III",
            label: "III Semestre",
          },
        ]}
      />

      <Text style={{ fontSize: 16, marginTop: 20 }}>Seleccione un fondo:</Text>
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() => {
            setChosenCover(0);
            Keyboard.dismiss();
          }}
        >
          <Image
            source={covers[0]}
            style={{
              width: 170,
              height: 100,
              margin: 10,
              marginLeft: 0,
              marginBottom: 0,
              borderWidth: chosenCover === 0 ? 3 : 0,
              borderColor: chosenCover === 0 ? theme.colors.primary : "white",
            }}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            setChosenCover(1);
            Keyboard.dismiss();
          }}
        >
          <Image
            source={covers[1]}
            style={{
              width: 170,
              height: 100,
              margin: 10,
              marginLeft: 0,
              marginBottom: 0,
              borderWidth: chosenCover === 1 ? 3 : 0,
              borderColor: chosenCover === 1 ? theme.colors.primary : "white",
            }}
          />
        </Pressable>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Pressable
          onPress={() => {
            setChosenCover(2);
            Keyboard.dismiss();
          }}
        >
          <Image
            source={covers[2]}
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
        <Pressable
          onPress={() => {
            setChosenCover(3);
            Keyboard.dismiss();
          }}
        >
          <Image
            source={covers[3]}
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
        handlePress={handleSubmit((form) => {
          onSubmit(form);
        })}
      />
    </View>
  );
}

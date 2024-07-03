import { theme } from "@/constants/theme";
import { router } from "expo-router";
import { FlatList, Pressable, ScrollView, View } from "react-native";
import { Button, Card } from "react-native-paper";
import { useFetchGroups } from "../hooks/useFetchData";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../hooks/context/UserContext";

const images = [
  require("../../assets/images/cover1.jpg"),
  require("../../assets/images/cover2.jpg"),
  require("../../assets/images/cover3.jpg"),
  require("../../assets/images/cover4.jpg"),
];
export default function ManageGroups() {
  const { userData } = useContext(UserContext);
  const groups = useFetchGroups(userData);

  return (
    <View style={{ flex: 1, alignContent: "center", justifyContent: "center" }}>
      <ScrollView>
        <View style={{ backgroundColor: "#FFF" }}>
          {userData?.Role === "Administrador" ? (
            <Button
              mode="contained"
              buttonColor={theme.colors.primary}
              style={{
                width: "50%",
                alignSelf: "flex-end",
                marginRight: 20,
                marginTop: 30,
              }}
              labelStyle={{ fontSize: 16 }}
              onPress={() =>
                router.push("../components/management/CreateGroup")
              }
            >
              Crear Grupo
            </Button>
          ) : null}

          <Card.Title
            title={"Lista de Grupos"}
            style={{ marginLeft: 10 }}
            titleVariant="titleLarge"
          />
          <Card.Content>
            <FlatList
              data={groups}
              keyExtractor={(teacher) => teacher.id}
              scrollEnabled={false}
              renderItem={(item) => (
                <Pressable>
                  <Card
                    style={{
                      padding: 10,
                      marginVertical: 15,
                      backgroundColor: "#FFF",
                    }}
                  >
                    <Card.Title
                      title={
                        "Grupo " +
                        item.item.GroupNumber.toString().padStart(3, "0")
                      }
                    />
                    <Card.Cover
                      source={images[item.item.Cover]}
                      style={{ height: 125 }}
                    />
                    <Card.Title title={item.item.id} />
                  </Card>
                </Pressable>
              )}
            />
          </Card.Content>
          {userData?.Role === "Administrador" ? (
            <Button
              mode="contained"
              buttonColor="red"
              style={{
                width: "50%",
                alignSelf: "center",
                marginRight: 10,
                marginTop: 50,
                marginBottom: 30,
              }}
              labelStyle={{ fontSize: 16 }}
              onPress={() => {}}
            >
              Eliminar Grupo
            </Button>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

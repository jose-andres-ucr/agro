import { useState } from "react";
import { Pressable, TextInput, View, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import { router } from "expo-router";
import Spinner from "../Spinner";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleUser = (text: string) => {
    setUserName(text);
  };

  const handlePassword = (text: string) => {
    setPassword(text);
  };

  const [loading, setLoading] = useState(false);
  //TODO: validate inputs
  const handleAuth = () => {
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(userName, password)
      .then(() => {
        console.log("User login!");
        setTimeout(() => {
          setLoading(false);
          router.back();
          router.replace("/(tabs)/profile");
        }, 2000);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      {loading === false ? (
        <View>
          <View>
            <TextInput
              textContentType="emailAddress"
              placeholder="Usuario"
              onChangeText={handleUser}
            />
          </View>

          <View>
            <TextInput
              textContentType="password"
              placeholder="Contraseña"
              onChangeText={handlePassword}
            />
          </View>

          <Pressable onPress={handleAuth}>
            <Text>Ingresar</Text>
          </Pressable>
        </View>
      ) : (
        <Spinner />
      )}
    </>
  );
}

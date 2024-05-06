import { useState } from "react";
import { Pressable, TextInput, View, Text } from "react-native";
import auth from "@react-native-firebase/auth";
import { router } from "expo-router";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleUser = (text: string) => {
    setUserName(text);
  };

  const handlePassword = (text: string) => {
    setPassword(text);
  };

  const handleAuth = () => {
    auth()
      .signInWithEmailAndPassword(userName, password)
      .then(() => {
        console.log("Sesión iniciada");
        router.back();
      })
      .catch((error) => console.log(error));
  };

  return (
    <View>
      <View>
        <TextInput
          textContentType="emailAddress"
          defaultValue="Usuario"
          onChangeText={handleUser}
        />
      </View>

      <View>
        <TextInput
          textContentType="password"
          defaultValue="Contraseña"
          onChangeText={handlePassword}
        />
      </View>

      <Pressable onPress={handleAuth}>
        <Text>Ingresar</Text>
      </Pressable>
    </View>
  );
}

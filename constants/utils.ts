import Toast from "react-native-toast-message";

export const showToastError = (title:string, message: string | undefined) => {
    Toast.show({
      type: "error",
      text1: title,
      text2: message || "Error",
      position: "bottom",
      visibilityTime: 3000,
    });
  } 
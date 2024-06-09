import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useMemo } from "react";


const getCommentLogStyles = (theme: any) => StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    alignSelf: "center",
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '100%',
    backgroundColor: 'lightblue',
  },
  commentBox: {
    marginBottom: 10,
    borderWidth: 3,
    borderRadius: 15,
    borderColor: 'lightblue',
    alignSelf: 'stretch',
  },
  commentContainer: {
    padding: 10,
  },
  commentName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentDateTime: {
    fontStyle: 'italic',
  },
  commentText: {
    marginBottom: 10,
  },
  commentResponse: {
    marginTop: 10,
    color: 'green', // Agregar estilo para el color verde
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  inputComment: {
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  successMessage: {
    color: 'green',
    marginTop: 10,
  },
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    marginVertical: 10,
  },
  selectedPostDescription: {
    lineHeight: 22,
    marginBottom: 20,
    fontSize: 16,
  },
  postAttachment: {
    color: 'blue',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    alignSelf: "center",
  },
  response: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "black",
  },
});

export default function useCommentLogStyles() {
    const theme = useTheme();
    return useMemo(() => getCommentLogStyles(theme), [theme]);
}
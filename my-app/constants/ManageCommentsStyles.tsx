import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { useMemo } from "react";


const getManageCommentsStyles = (theme: any) => StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: theme.colors.defaultBackgroundColor,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: "center",
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
    marginBottom: 5,
    color: 'gray',
  },
  commentText: {
    lineHeight: 20,
  },
  commentResponse: {
    marginTop: 10,
    fontStyle: 'italic',
    color: 'green',
  },
  response: {
    fontSize: 18,
    fontWeight: 'bold',
    color: "#005da4",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  button: {
    backgroundColor: "#005da4",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 5,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  commentSeparator: {
    marginVertical: 10,
    height: 1,
    width: '100%',
    backgroundColor: 'lightblue',
  }, 
});

export default function useManageCommentsStyles() {
    const theme = useTheme();
    return useMemo(() => getManageCommentsStyles(theme), [theme]);
}
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

const getEducationStyles = (theme: any) => StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    backgroundColor: theme.colors.defaultBackgroundColor,
  },
  container: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    flex: 1,
    backgroundColor: theme.colors.defaultBackgroundColor,
  },
  postDetailscontainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    flex: 1,
  },
  titleAndButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    color: 'black',
    alignSelf: 'center',
  },
  postContainer: {
    padding: 10,
  },
  postTitle: {
    marginBottom: 5,
    fontSize: 16,
  },
  postAutorDate: {
    marginBottom: 5,
    color: 'gray',
  },
  postDescription: {
    lineHeight: 22,
    marginBottom: 5,
    fontSize: 14,
  },
  selectedPostTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
    color: 'black',
    alignSelf: 'center',
    flex: 1, 
    textAlign: 'center', 
  },
  selectedPostAutorDate: {
    marginBottom: 25,
    color: 'gray',
  },
  selectedPostDescription: {
    lineHeight: 22,
    marginBottom: 20,
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  pageButton: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  pageNumber: {
    fontSize: 16,
  },
  disabled: {
    color: 'gray',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: theme.colors.defaultBackgroundColor,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  horizontalLine: {
    borderBottomColor: 'black', 
    borderBottomWidth: 0.5,
    marginVertical: 10, 
  },
  postAttachment: {
    color: 'blue',
    marginBottom: 20,
    textDecorationLine: 'underline',
  },
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default function useEducationStyles() {
  const theme = useTheme();
  return useMemo(() => getEducationStyles(theme), [theme]);
}
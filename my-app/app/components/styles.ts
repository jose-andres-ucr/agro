// styles.js

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  container: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    flex: 1,
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
    color: 'steelblue',
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
    color: 'steelblue',
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
    color: 'blue',
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
    backgroundColor: '#F7F7F7',
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
  separator: {
    marginVertical: 10,
    height: 1,
    width: '100%',
    backgroundColor: 'steelblue',
  },
  input: {
    width: '100%',
    height: 40,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  inputComment: {
    width: '100%',
    height: 100,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    textAlignVertical: "top",
  },
});

export default styles;

import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const getUniqueUserId = async () => {
  let userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    userId = uuidv4(); // Genera un ID único
    await AsyncStorage.setItem('userId', userId);
  }
  return userId;
};
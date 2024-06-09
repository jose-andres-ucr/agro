import { createContext } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// Tipo de datos del contexto
interface UserContextType {
  userAuth: FirebaseAuthTypes.User | null;
  userId: string | undefined;
  userData: FirebaseFirestoreTypes.DocumentData | null;
}
const defaultUserContext: UserContextType = {
  userAuth: null,
  userId: undefined,
  userData: null,
};

export const UserContext = createContext<UserContextType>(defaultUserContext);

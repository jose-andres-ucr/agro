import useUserRole from '@/app/hooks/useUserRole';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

jest.mock('../hooks/useUserRole');
jest.mock('@react-native-firebase/auth', () => ({
  signOut: jest.fn(),
}));
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
  },
  usePathname: jest.fn(() => '/components/login/Login'),
}));

export const configureMocksForRole = (role: string | null) => {
  const userRoleMock = {
    userRole: role,
    profile: role === "Administrador" || role === "Docente" || role === "Estudiante" || role === "Usuario Externo" ? "/profile" : null,
    manageRegister: role === "Administrador" ? "true" : null,
    manageComments: role === "Administrador" ? "true" : null,
    manageEducation: role === "Administrador" ? "true" : null,
    education: role === "Administrador" || role === "Docente" || role === "Estudiante" ? "/education" : null,
    informativeSection: role ? "true" : null,
  };

  (useUserRole as jest.Mock).mockReturnValue(userRoleMock);

  const userAuthMock: FirebaseAuthTypes.User = {
      uid: 'mockUserId',
      email: 'user@example.com',
      emailVerified: true,
      displayName: 'Mock User',
      isAnonymous: false,
      metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString(),
      },
      phoneNumber: null,
      photoURL: null,
      providerData: [],
      providerId: '',
      delete: jest.fn(),
      getIdToken: jest.fn(),
      getIdTokenResult: jest.fn(),
      linkWithCredential: jest.fn(),
      reauthenticateWithCredential: jest.fn(),
      reload: jest.fn(),
      sendEmailVerification: jest.fn(),
      unlink: jest.fn(),
      updateEmail: jest.fn(),
      updatePassword: jest.fn(),
      updateProfile: jest.fn(),
      verifyBeforeUpdateEmail: jest.fn(),
      toJSON: jest.fn(),
      multiFactor: null,
      linkWithPopup: function (provider: FirebaseAuthTypes.AuthProvider): Promise<FirebaseAuthTypes.UserCredential> {
          throw new Error('Function not implemented.');
      },
      linkWithRedirect: function (provider: FirebaseAuthTypes.AuthProvider): Promise<FirebaseAuthTypes.UserCredential> {
          throw new Error('Function not implemented.');
      },
      reauthenticateWithProvider: function (provider: FirebaseAuthTypes.AuthProvider): Promise<FirebaseAuthTypes.UserCredential> {
          throw new Error('Function not implemented.');
      },
      updatePhoneNumber: function (credential: FirebaseAuthTypes.AuthCredential): Promise<void> {
          throw new Error('Function not implemented.');
      }
  };

  const userContextValue = {
    userAuth: userAuthMock,
    userId: "mockUserId",
    userData: { Approved: 1, Role: role },
  };

  return userContextValue;
};
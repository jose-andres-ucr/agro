import { Drawer } from "expo-router/drawer";
import { theme } from "@/constants/theme";
import { Image, View } from "react-native";
import DrawerIcons from "@/constants/DrawerIcons";
import LoginButton from "../components/login/LoginButton";
import ProfileButton from "../components/ProfileButton";
import useUserRole from "../hooks/UserRole";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import getDrawerStyles from '@/constants/styles/DrawerStyles';

export default function TabLayout() {
  const { userRole, profile, manageRegister, manageComments, manageEducation, education  } = useUserRole();
  const { profileIcon, herbicideIcon, educationIcon, fungicideIcon, manageMaterialIcon, manageRegisterIcon } = DrawerIcons();
  const styles = getDrawerStyles();

  const HeaderButton = () => {
    if (userRole != null) {
      return <ProfileButton/>;
    } else {
      return <LoginButton/>;
    }
  };
  function CustomerDrawer(props: any) {
    return (
      <DrawerContentScrollView {...props}>
        <View>
          <Image
            source={require('../../assets/images/firmaPromocional.png')}
            style={styles.image}
          />
        </View>
        <DrawerItemList {...props}/>
      </DrawerContentScrollView>
    );
  }
  return (
    <GestureHandlerRootView style={{flex: 1}}>
    <Drawer
      drawerContent={CustomerDrawer}
      screenOptions={{
        drawerActiveBackgroundColor: theme.colors.primary,
        drawerActiveTintColor: theme.colors.white,
        drawerInactiveTintColor: 'black',
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Herbicidas",
          drawerLabel: "Herbicidas",
          drawerIcon: herbicideIcon,
          headerRight: () => <HeaderButton />,
        }}
      />
      <Drawer.Screen
        name="fungicides"
        options={{
          title: "Fungicidas e Insecticidas",
          drawerLabel: "Fungicidas e Insecticidas",
          drawerIcon: fungicideIcon,
          headerRight: () => <HeaderButton />,
        }}
      />
      <Drawer.Screen
        name="education"
        redirect={education === null}
        options={{
          title: "Material Educativo",
          drawerLabel: "Material Educativo",
          drawerIcon: educationIcon,
          headerRight: () => <HeaderButton />,
        }}
      />
      <Drawer.Screen
        name="manageEducation"
        redirect={manageEducation === null}
        options={{
          title: "Administrar Material",
          drawerLabel: "Administrar Material",
          drawerIcon: manageMaterialIcon,
          headerRight: () => <HeaderButton />,
        }}
      />
      <Drawer.Screen
        name="manageRegistration"
        redirect={manageRegister === null}
        options={{
          title: "Aprobación de Registro",
          drawerLabel: "Aprobación de Registro",
          drawerIcon: manageRegisterIcon,
          headerRight: () => <HeaderButton />,
        }}
      />
      <Drawer.Screen
        name="profile"
        redirect={profile === null}
        options={{
          title: "Perfil",
          drawerLabel: "Perfil",
          drawerIcon: profileIcon
        }}
      />
    </Drawer>
    </GestureHandlerRootView>
  );
}

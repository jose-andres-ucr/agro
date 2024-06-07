import { Drawer } from "expo-router/drawer";
import { theme } from "@/constants/theme";
import { Image, View } from "react-native";
import { ProfileIcon, EducationIcon, HerbicideIcon, FungicideIcon, ManageIcon } from "@/constants/DrawerIcons";
import LoginButton from "../components/login/LoginButton";
import ProfileButton from "../components/ProfileButton";
import useUserRole from "../hooks/UserRole";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

export default function TabLayout() {
  const { userRole, profile, manageRegister, manageComments, manageEducation, education  } = useUserRole();

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
            style={{width: 175, height: 75, alignSelf: "center", marginVertical: 20}}
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
        drawerInactiveTintColor: '#000',
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Herbicidas",
          drawerLabel: "Herbicidas",
          drawerIcon: HerbicideIcon,
          headerRight: () => <HeaderButton />,
        }}
      />
      <Drawer.Screen
        name="fungicides"
        options={{
          title: "Fungicidas e Insecticidas",
          drawerLabel: "Fungicidas e Insecticidas",
          drawerIcon: FungicideIcon,
          headerRight: () => <HeaderButton />,
        }}
      />
      <Drawer.Screen
        name="education"
        redirect={education === null}
        options={{
          title: "Material Educativo",
          drawerLabel: "Material Educativo",
          drawerIcon: EducationIcon,
          headerRight: () => <HeaderButton />,
        }}
      />
      <Drawer.Screen
        name="manageRegistration"
        redirect={manageRegister === null}
        options={{
          title: "Aprobación de Registros",
          drawerLabel: "Aprobación de Registros",
          drawerIcon: ManageIcon,
          headerRight: () => <HeaderButton />,
        }}
      />
      <Drawer.Screen
        name="profile"
        redirect={profile === null}
        options={{
          title: "Perfil",
          drawerLabel: "Perfil",
          drawerIcon: ProfileIcon
        }}
      />
    </Drawer>
    </GestureHandlerRootView>
  );
}

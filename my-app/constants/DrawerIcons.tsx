import { FontAwesome6 } from '@expo/vector-icons';

export const DrawerIcons = () => {
  const size = 20;
  const herbicideIcon = ({color}) =>
    <FontAwesome6 name="bottle-droplet" size={size} color={color} />
  const fungicideIcon = ({color}) =>
    <FontAwesome6 name="spray-can" size={size} color={color} />
  const educationIcon = ({color}) =>
    <FontAwesome6 name="book" size={size} color={color} />
  const manageMaterialIcon = ({color}) =>
    <FontAwesome6 name="book-open-reader" size={size} color={color} />
  const manageRegisterIcon = ({color}) =>
    <FontAwesome6 name="user-gear" size={size} color={color} />
  const profileIcon = ({color}) =>
    <FontAwesome6 name="user-large" size={size} color={color} />

  return { profileIcon, herbicideIcon, educationIcon, fungicideIcon, manageMaterialIcon, manageRegisterIcon }
};

export default DrawerIcons;
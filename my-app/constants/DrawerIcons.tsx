import { FontAwesome6 } from '@expo/vector-icons';

export const DrawerIcons = () => {
  const herbicideIcon = ({color, size}) =>
    <FontAwesome6 name="bottle-droplet" size={size} color={color} />
  const fungicideIcon = ({color, size}) =>
    <FontAwesome6 name="spray-can" size={size} color={color} />
  const educationIcon = ({color, size}) =>
    <FontAwesome6 name="book" size={size} color={color} />
  const manageMaterialIcon = ({color, size}) =>
    <FontAwesome6 name="book-open-reader" size={size} color={color} />
  const manageRegisterIcon = ({color, size}) =>
    <FontAwesome6 name="user-gear" size={size} color={color} />
  const profileIcon = ({color, size}) =>
    <FontAwesome6 name="user-large" size={size} color={color} />

  return { profileIcon, herbicideIcon, educationIcon, fungicideIcon, manageMaterialIcon, manageRegisterIcon }
};

export default DrawerIcons;
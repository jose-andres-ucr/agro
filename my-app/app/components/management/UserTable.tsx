import { DataTable } from "react-native-paper";
import { useFetchPendingRegistration } from "@/app/hooks/FetchData";
import { useEffect, useState } from "react";
import { View } from "react-native";
import ApproveModal from "./ApproveModal";

type User = {
  id: string;
  FirstName: string;
  LastName: string;
  SecondLastName: string | null;
  Email: string;
  Role: string;
  Approved: number;
};

const UserTable = () => {
  const users = useFetchPendingRegistration();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const handlePress = (user: User) => {
    setSelectedUser(user);
    setShowUserInfo(true);
  };

  return (
    <View>
      <ApproveModal
        showModal={showUserInfo}
        handleOnDismiss={() => setShowUserInfo(!showUserInfo)}
        user={selectedUser}
      />
      <DataTable>
        <DataTable.Header>
          <DataTable.Title
            sortDirection="descending"
            textStyle={{ fontSize: 14 }}
            style={{ flex: 4 }}
          >
            Correo Electrónico
          </DataTable.Title>
          <DataTable.Title textStyle={{ fontSize: 14 }}>Rol</DataTable.Title>
        </DataTable.Header>
        {users.map((user) => (
          <DataTable.Row key={user.id} onPress={() => handlePress(user)}>
            <DataTable.Cell style={{ flex: 4 }}>{user.Email}</DataTable.Cell>
            <DataTable.Cell>{user.Role}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </View>
  );
};

export default UserTable;

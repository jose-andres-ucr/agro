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

const numberOfUsersPerPageList = [5, 10];

const UserTable = () => {
  const allUsers = useFetchPendingRegistration();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const handlePress = (user: User) => {
    setSelectedUser(user);
    setShowUserInfo(true);
  };

  const [page, setPage] = useState(0);
  const [numberOfUsersPerPage, onUsersPerPageChange] = useState(
    numberOfUsersPerPageList[0]
  );
  const from = page * numberOfUsersPerPage;
  const to = Math.min((page + 1) * numberOfUsersPerPage, allUsers.length);

  const [usersToShow, setUsersToShow] = useState<User[] | null>(null);
  useEffect(() => {
    if (allUsers) {
      setUsersToShow(allUsers.slice(from, to));
    }
  }, [allUsers, to]);

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
        {usersToShow?.map((user) => (
          <DataTable.Row key={user.id} onPress={() => handlePress(user)}>
            <DataTable.Cell style={{ flex: 4 }}>{user.Email}</DataTable.Cell>
            <DataTable.Cell>
              {user.Role === "Usuario Externo" ? "Externo" : user.Role}
            </DataTable.Cell>
          </DataTable.Row>
        ))}
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(allUsers.length / numberOfUsersPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} de ${allUsers.length}`}
          showFastPaginationControls
          numberOfItemsPerPageList={numberOfUsersPerPageList}
          numberOfItemsPerPage={numberOfUsersPerPage}
          onItemsPerPageChange={onUsersPerPageChange}
          selectPageDropdownLabel={"Usuarios Por Página"}
        />
      </DataTable>
    </View>
  );
};

export default UserTable;

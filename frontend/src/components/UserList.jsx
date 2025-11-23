import React from "react";
import MainLayout from "./MainLayout";
import useDocumentTitle from "../hooks/useDocumentTitle";
import UserListContent from "./UserListContent";

const UserList = () => {
    useDocumentTitle("Danh sách người dùng - Google Photos Clone");
  
  return (
    <MainLayout>
      <UserListContent />
    </MainLayout>
  );
};

export default UserList;

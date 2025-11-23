import React from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import MainLayout from "./MainLayout";
import UserProfileEditContent from "./UserProfileEditContent";

const UserProfileEdit = () => {
  useDocumentTitle("Chỉnh sửa hồ sơ - Google Photos Clone");
  
  return (
    <MainLayout>
      <UserProfileEditContent />
    </MainLayout>
  );
};

export default UserProfileEdit;

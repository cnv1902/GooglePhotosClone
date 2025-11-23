import React from "react";
import useDocumentTitle from "../hooks/useDocumentTitle";
import MainLayout from "./MainLayout";
import Dashboard from "./Dashboard";

const Index = () => {
  useDocumentTitle("Trang chủ - Google Photos Clone");

  return (
    <MainLayout>
      <Dashboard />
    </MainLayout>
  );
};

export default Index;

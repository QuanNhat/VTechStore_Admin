import { Layout } from "antd";
import { Footer } from "antd/es/layout/layout";
import React from "react";
import CustomSidebar from "../common/CustomSidebar";

interface IProps {
  children: React.ReactNode;
}
const CustomLayout: React.FC<IProps> = ({ children }) => {
  return (
    <Layout hasSider style={{ overflow: "hidden" }}>
      <CustomSidebar />

      <Layout style={{ marginLeft: 200 }}>
        <div className="p-5 overflow-y-auto min-h-screen">{children}</div>
        <Footer style={{ textAlign: "center" }}>
          <div className="">© 2023 - Bản quyền thuộc về Công ty TNHH VTECHSTORE</div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;

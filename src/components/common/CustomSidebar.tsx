import logo from "@/assets/icons/logo.svg";
import { useAuthContext } from "@/context/AuthProvider";
import { routes } from "@/utils/constant";
import { handleGetIndexPage } from "@/utils/func";
import { DesktopOutlined, LoginOutlined, PieChartFilled } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import React from "react";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const CustomSidebar: React.FC = () => {
  const { reset } = useAuthContext();
  const { pathname } = useLocation();
  const defaultSelectedKeys = handleGetIndexPage(pathname);

  const items: MenuItem[] = [
    getItem(<Link to={routes.home}>Quản lý người dùng</Link>, "1", <DesktopOutlined />),
    getItem(<Link to={routes.product}>Quản lý sản phẩm</Link>, "2", <DesktopOutlined />),
    getItem(<Link to={routes.category}>Quản lý danh mục</Link>, "3", <DesktopOutlined />),
    getItem(<Link to={routes.report}>Thống kê</Link>, "4", <PieChartFilled />),
    getItem(<div onClick={reset}>Đăng xuất</div>, "5", <LoginOutlined />),
  ];

  return (
    <Sider
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="mx-auto mb-5 px-2 pt">
        <img src={logo} alt="logo" className="w-2/3" />
      </div>
      <div className="demo-logo-vertical" />
      <Menu theme="dark" mode="inline" defaultSelectedKeys={[defaultSelectedKeys]} items={items} />
    </Sider>
  );
};

export default CustomSidebar;

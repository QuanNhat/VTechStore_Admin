import logo from "@/assets/icons/logo.svg";
import { useAuthContext } from "@/context/AuthProvider";
import authService from "@/services/authService";
import { routes } from "@/utils/constant";
import { setLocalStorage, storageConstants } from "@/utils/localStorage";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface FieldType {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setProfile } = useAuthContext();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    try {
      const res = await authService.login(values);
      if (res?.data?.data?.access_token) {
        console.log("res: ", res);
        setLocalStorage(storageConstants.profile, res?.data?.data?.user);
        setLocalStorage(storageConstants.accessToken, res?.data?.data?.access_token);
        setLocalStorage(storageConstants.refreshToken, res?.data?.data?.refresh_token);

        setIsAuthenticated(true);
        setProfile(res?.data?.data?.user);
        toast.success(res?.data?.message);
        navigate(routes.home);
      } else {
        const errorMessage = res?.data;
        const msg = Object.values(errorMessage);
        toast.error(msg?.[0] || errorMessage?.message);
      }
    } catch (error: any) {
      console.log("error: ", error);
      const errorMessage = error?.response?.data;
      const msg = Object.values(errorMessage?.data);
      toast.error(msg?.[0] || errorMessage?.message);
    }
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="grid grid-cols-2">
      <div className="bg-cyan-600 flex items-center justify-center h-screen w-full">
        <img src={logo} alt="logo" />
      </div>

      <div className="flex flex-col justify-center items-center gap-10">
        <div className="text-3xl text-center ">Đăng nhập</div>
        <Form
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item<FieldType>
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full mt-6">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;

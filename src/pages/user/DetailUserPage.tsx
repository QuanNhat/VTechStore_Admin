import CustomContent from "@/components/common/CustomContent";
import CustomHeader from "@/components/common/CustomHeader";
import userService from "@/services/userService";
import { User } from "@/types/user";
import { Button, DatePicker, Form, FormProps, Input, InputNumber, Radio } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const dateFormat = "YYYY-MM-DD";

interface FieldType extends Omit<User, "avatar"> {
  password: string;
}

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const ERROR_UPDATE = "Error update";
const ERROR_FETCH_USER = "Error fetchDataInit";

const DetailUserPage = () => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<User>({
    _id: "",
    roles: [],
    email: "",
    name: "",
    address: "",
    phone: "",
    date_of_birth: "",
  });

  const handleBack = () => navigate(-1);

  const handleCancel = () => {
    handleBack();
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const formatValues = { ...data, ...values, roles: [values.roles] };
    try {
      const res = await userService.updateUser(formatValues);
      if (res?.data) {
        toast.success(res?.data?.message);
        handleBack();
      } else {
        toast.error(ERROR_UPDATE);
      }
    } catch (error: any) {
      console.log("error: ", error);
      toast.error(error?.message || ERROR_UPDATE);
    }
  };

  const fetchDataInit = async () => {
    setLoading(true);
    try {
      const res = await userService.getDetailUser(id);
      if (res) {
        setData(res?.data?.data);
      }
    } catch (error: any) {
      console.log("error: ", error);
      toast.error(error?.message || ERROR_FETCH_USER);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataInit();
  }, [id]);

  return (
    <div>
      <CustomHeader title="Chỉnh sửa người dùng" />
      {!loading && (
        <CustomContent>
          <Form
            name="add-user"
            layout="vertical"
            onFinish={onFinish}
            validateMessages={validateMessages}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Form.Item<FieldType>
                name={"name"}
                label="Tên"
                rules={[{ required: true }]}
                initialValue={data?.name}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Chức vụ"
                name="roles"
                rules={[{ required: true }]}
                initialValue={data?.roles[0]}
              >
                <Radio.Group>
                  <Radio.Button value="Admin">Admin</Radio.Button>
                  <Radio.Button value="User">User</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item<FieldType>
                name={"email"}
                label="Email"
                rules={[{ required: true, type: "email" }]}
                initialValue={data?.email}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Mật khẩu"
                name="password"
                rules={[{ message: "Please input your password!" }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item<FieldType>
                name={"phone"}
                label="Số điện thoại"
                rules={[{ type: "number" }]}
                initialValue={Number(data?.phone)}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item<FieldType> name={"address"} label="Địa chỉ" initialValue={data?.address}>
                <Input.TextArea />
              </Form.Item>

              <Form.Item<FieldType>
                name={"date_of_birth"}
                label="Ngày sinh"
                initialValue={data?.date_of_birth && dayjs(data?.date_of_birth, dateFormat)}
              >
                <DatePicker />
              </Form.Item>
            </div>

            <div className="flex items-center justify-end gap-4 w-full mt-10">
              <Button type="primary" onClick={handleCancel} ghost>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </div>
          </Form>
        </CustomContent>
      )}
    </div>
  );
};

export default DetailUserPage;

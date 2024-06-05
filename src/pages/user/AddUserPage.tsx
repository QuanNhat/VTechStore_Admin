import CustomContent from "@/components/common/CustomContent";
import CustomHeader from "@/components/common/CustomHeader";
import userService from "@/services/userService";
import { User } from "@/types/user";
import { Button, DatePicker, Form, FormProps, Input, InputNumber, Radio } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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

const ERROR_ADD = "Error add";

const AddUserPage = () => {
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  const handleCancel = () => {
    handleBack();
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const formatValues = { ...values, roles: [values.roles] };
    try {
      const res = await userService.createUser(formatValues);
      if (res?.data) {
        toast.success(res?.data?.message);
        handleBack();
      } else {
        toast.error(ERROR_ADD);
      }
    } catch (error: any) {
      console.log("error: ", error);
      toast.error(error?.message || ERROR_ADD);
    }
  };

  return (
    <div>
      <CustomHeader title="Thêm người dùng" />
      <CustomContent>
        <Form
          name="add-user"
          layout="vertical"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Form.Item<FieldType> name={"name"} label="Tên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item<FieldType> label="Chức vụ" name="roles">
              <Radio.Group>
                <Radio.Button value="Admin">Admin</Radio.Button>
                <Radio.Button value="User">User</Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item<FieldType>
              name={"email"}
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item<FieldType>
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item<FieldType> name={"phone"} label="Số điện thoại" rules={[{ type: "number" }]}>
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item<FieldType> name={"address"} label="Địa chỉ">
              <Input.TextArea />
            </Form.Item>

            <Form.Item<FieldType> name={"date_of_birth"} label="Ngày sinh">
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
    </div>
  );
};

export default AddUserPage;

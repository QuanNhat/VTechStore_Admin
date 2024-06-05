import CustomContent from "@/components/common/CustomContent";
import CustomHeader from "@/components/common/CustomHeader";
import categoryService from "@/services/categoryService";
import { Category } from "@/types/category";
import { Button, Form, FormProps, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface FieldType extends Omit<Category, "_id"> {}

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

const AddCategoryPage = () => {
  const navigate = useNavigate();

  const handleBack = () => navigate(-1);

  const handleCancel = () => {
    handleBack();
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const formatValues = { ...values };
    try {
      const res = await categoryService.createCategory(formatValues);
      if (res?.data) {
        toast.success(res?.data?.message);
        handleBack();
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

  return (
    <div>
      <CustomHeader title="Thêm danh mục" />
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

export default AddCategoryPage;

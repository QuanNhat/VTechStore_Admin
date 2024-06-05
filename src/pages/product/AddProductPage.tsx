import CustomContent from "@/components/common/CustomContent";
import CustomHeader from "@/components/common/CustomHeader";
import CustomSelectCategory from "@/components/common/CustomSelectCategory";
import CustomUploadImg from "@/components/common/CustomUploadImg";
import CustomUploadListImg from "@/components/common/CustomUploadListImg";
import productService from "@/services/productService";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { Button, Form, FormProps, Input, InputNumber, Radio } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface FieldType extends Omit<Product, "createdAt" | "updatedAt" | "category"> {}

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

const AddProductPage = () => {
  const navigate = useNavigate();
  const [selectCategory, setSelectCategory] = useState<Category | null>(null);
  const [image, setImage] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);

  const handleBack = () => navigate(-1);

  const handleCancel = () => {
    handleBack();
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const formatValues = {
      ...values,
      category: selectCategory,
      image,
      images,
    };
    try {
      const res = await productService.createProduct(formatValues);
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
      <CustomHeader title="Thêm sản phẩm" />

      <CustomContent>
        <Form
          name="add-product"
          layout="vertical"
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Form.Item<FieldType> name={"name"} label="Tên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item<FieldType> label="Danh mục">
              <CustomSelectCategory onChange={setSelectCategory} />
            </Form.Item>

            <Form.Item<FieldType> label="Ảnh bìa">
              <CustomUploadImg setValue={setImage} />
            </Form.Item>

            <Form.Item<FieldType> label="Hình ảnh mô tả liên quan">
              <CustomUploadListImg setValue={setImages} />
            </Form.Item>

            <Form.Item<FieldType>
              name={"price_before_discount"}
              label="Giá gốc"
              rules={[{ type: "number", required: true }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item<FieldType>
              name={"price"}
              label="Giá đã giảm"
              rules={[{ type: "number", required: true }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item<FieldType>
              name={"quantity"}
              label="Số lượng"
              rules={[{ type: "number", required: true }]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </div>

          <Form.Item<FieldType> name={"description"} label="Mô tả" rules={[{ required: true }]}>
            <TextArea />
          </Form.Item>

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

export default AddProductPage;

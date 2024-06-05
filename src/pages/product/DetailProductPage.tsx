import CustomContent from "@/components/common/CustomContent";
import CustomHeader from "@/components/common/CustomHeader";
import CustomSelectCategory from "@/components/common/CustomSelectCategory";
import CustomUploadImg from "@/components/common/CustomUploadImg";
import CustomUploadListImg from "@/components/common/CustomUploadListImg";
import productService from "@/services/productService";
import { Category } from "@/types/category";
import { Product } from "@/types/product";
import { removeEndpoint } from "@/utils/func";
import { Button, Form, FormProps, Input, InputNumber } from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

dayjs.extend(customParseFormat);

const dateFormat = "YYYY-MM-DD";

interface FieldType extends Omit<Product, "createdAt" | "updatedAt" | "category"> {
  categoryName: string;
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

const DetailProductPage = () => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Product>({
    _id: id,
    name: "",
    price: 0,
    price_before_discount: 0,
    quantity: 0,
    description: "",
    sold: 0,
    view: 0,
    rating: 0,
    images: [],
    image: "",
    category: {
      _id: "",
      name: "",
    },
    createdAt: "",
    updatedAt: "",
  });

  const handleBack = () => navigate(-1);

  const handleCancel = () => {
    handleBack();
  };

  const handleUpdateCategory = (data: Category) => {
    setData((prev) => ({
      ...prev,
      category: data,
    }));
  };

  const handleUpdateImage = (data: string) => {
    setData((prev) => {
      const result = data || prev.image;
      return {
        ...prev,
        image: removeEndpoint(result),
      };
    });
  };

  const handleUpdateListImage = (data: string[]) => {
    setData((prev) => {
      const value = data || prev.images || [];
      const saltValue = value?.map(removeEndpoint);
      return {
        ...prev,
        images: saltValue,
      };
    });
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const formatValues = {
      ...data,
      ...values,
      image: removeEndpoint(data?.image),
      images: data?.images?.map(removeEndpoint),
    };
    try {
      const res = await productService.updateProduct(formatValues);
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
      const res = await productService.getDetailProduct(id);
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
      <CustomHeader title="Chỉnh sửa sản phẩm" />
      {!loading && (
        <CustomContent>
          <Form
            name="edit-user"
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

              <Form.Item<FieldType> label="Danh mục" initialValue={data?.category}>
                <CustomSelectCategory value={data?.category} onChange={handleUpdateCategory} />
              </Form.Item>

              <Form.Item<FieldType> label="Ảnh bìa" initialValue={data?.image}>
                <CustomUploadImg value={data?.image} setValue={handleUpdateImage} />
              </Form.Item>

              <Form.Item<FieldType> label="Hình ảnh mô tả" initialValue={data?.images}>
                <CustomUploadListImg value={data?.images || []} setValue={handleUpdateListImage} />
              </Form.Item>

              <Form.Item<FieldType>
                name={"price_before_discount"}
                label="Giá gốc"
                rules={[{ type: "number", required: true }]}
                initialValue={data?.price_before_discount}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item<FieldType>
                name={"price"}
                label="Giá đã giảm"
                rules={[{ type: "number", required: true }]}
                initialValue={data?.price}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item<FieldType>
                name={"quantity"}
                label="Số lượng"
                rules={[{ type: "number", required: true }]}
                initialValue={data?.quantity}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </div>

            <Form.Item<FieldType>
              name={"description"}
              label="Mô tả"
              rules={[{ required: true }]}
              initialValue={data?.description}
            >
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
      )}
    </div>
  );
};

export default DetailProductPage;

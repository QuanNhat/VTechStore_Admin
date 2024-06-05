import CustomContent from "@/components/common/CustomContent";
import CustomHeader from "@/components/common/CustomHeader";
import categoryService from "@/services/categoryService";
import { Category } from "@/types/category";
import { Button, Form, FormProps, Input } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const DetailCategoryPage = () => {
  const navigate = useNavigate();
  const { id = "" } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Category>({
    _id: id,
    name: "",
  });

  // const normFile = (e: any) => {
  //   console.log("Upload event:", e);
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e?.fileList;
  // };

  const handleBack = () => navigate(-1);

  const handleCancel = () => {
    handleBack();
  };

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const formatValues = { ...data, ...values };
    try {
      const res = await categoryService.updateCategory(formatValues);
      if (res) {
        toast.success(res?.data?.message);
        handleBack();
      } else {
        toast.error("Error update");
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error("Error update");
    }
  };

  const fetchDataInit = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getDetailCategory(id);
      if (res) {
        setData(res?.data?.data);
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error("Error fetchDataInit");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataInit();
  }, [id]);

  return (
    <div>
      <CustomHeader title="Chỉnh sửa danh mục" />
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

              {/* <Form.Item<FieldType>
              name="avatar"
              label="Ảnh đại diện"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload.Dragger name="files" action="/upload.do">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
              </Upload.Dragger>
            </Form.Item> */}
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

export default DetailCategoryPage;

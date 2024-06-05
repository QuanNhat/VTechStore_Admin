import productService from "@/services/productService";
import { PlusOutlined } from "@ant-design/icons";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { Image, Upload } from "antd";
import React, { useState } from "react";

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface IProps {
  value?: string;
  setValue: (value: string) => void;
}

const CustomUploadImg: React.FC<IProps> = ({ value, setValue }) => {
  const formatInitImg = value
    ? [
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: value,
        },
      ]
    : [];
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<any[]>(formatInitImg);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = async ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <>
      <Upload
        // action={`${import.meta.env.VITE_API_ENDPOINT}/admin/products/upload-image`}
        accept="image/*"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        multiple={false}
        customRequest={async ({ file, onSuccess, onError }) => {
          const formData = new FormData();
          formData.append("image", file as FileType);

          try {
            const res = await productService.uploadImage(formData);
            if (res?.data) {
              if (onSuccess) {
                setValue(res?.data?.data);
                onSuccess(res.data);
              }
            }
          } catch (error: any) {
            console.log("error: ", error);
            if (onError) {
              onError(error);
            }
          }
        }}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
};

export default CustomUploadImg;

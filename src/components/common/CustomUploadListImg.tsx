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
  value?: string[];
  setValue: any;
}

const CustomUploadListImg: React.FC<IProps> = ({ value = [], setValue }) => {
  const formatInitImg =
    value && Array.isArray(value)
      ? value?.map((item, i) => ({
          uid: i.toString(),
          name: `image${i}.png`,
          status: "done",
          url: item,
        }))
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

  const handleRemove = async (file: UploadFile) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
    setValue(newFileList.map((item) => item.url));
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
        onRemove={handleRemove}
        accept="image/*"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        customRequest={async ({ file, onSuccess, onError }) => {
          const formData = new FormData();
          formData.append("image", file as FileType);

          try {
            const res = await productService.uploadImage(formData);
            if (res?.data) {
              console.log("res.data", res.data);
              if (onSuccess) {
                setValue([...value, res?.data?.data]);
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
        {fileList.length >= 8 ? null : uploadButton}
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

export default CustomUploadListImg;

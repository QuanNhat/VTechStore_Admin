import { ButtonDelete, ButtonEdit } from "@/components/common/CustomButtonAction";
import CustomHeader from "@/components/common/CustomHeader";
import ModalDelete from "@/components/common/ModalDelete";
import categoryService from "@/services/categoryService";
import { Category } from "@/types/category";
import { routes } from "@/utils/constant";
import type { TableProps } from "antd";
import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface DataType extends Category {}

const exampleList: DataType[] = [
  {
    _id: "60aba4e24efcc70f8892e1c6",
    name: "Xiaomi",
  },
];
const baseUrl = routes.category;

const TableCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<any[]>(exampleList);
  const [data, setData] = useState<any>(exampleList[0]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => setIsOpenModal(true);
  const handleCloseModal = () => setIsOpenModal(false);

  const handleEdit = (data: any) => {
    navigate(`${baseUrl}/${data?._id}`);
  };

  const handleOpenModalDelete = (data: any) => {
    setData(data);
    handleOpenModal();
  };

  const handleDelete = async () => {
    try {
      const res = await categoryService.deleteCategory(data?._id);
      if (res?.data) {
        toast.success(res?.data?.message);
        handleGetList();
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error");
    }
  };

  const handleAdd = () => {
    navigate(`${baseUrl}/add`);
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <div>{text}</div>,
    },

    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-8">
          <ButtonEdit onClick={() => handleEdit(record)} />
          <ButtonDelete onClick={() => handleOpenModalDelete(record)} />
        </div>
      ),
    },
  ];

  const handleGetList = async () => {
    try {
      const res = await categoryService.getListCategory();
      if (res?.data) {
        setList(res?.data?.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error");
    }
  };

  useEffect(() => {
    handleGetList();
  }, []);

  return (
    <>
      <ModalDelete
        isOpen={isOpenModal}
        handleCloseModal={handleCloseModal}
        data={data}
        handleConfirm={handleDelete}
      />

      <div className="flex flex-col">
        <CustomHeader title="Quản lý danh mục">
          <Button onClick={handleAdd} type="primary" ghost>
            Thêm mới
          </Button>
        </CustomHeader>

        <div className="pt-[30px] ">
          <Table columns={columns} dataSource={list} />
        </div>
      </div>
    </>
  );
};

export default TableCategoryPage;

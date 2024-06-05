import { ButtonDelete, ButtonEdit } from "@/components/common/CustomButtonAction";
import CustomHeader from "@/components/common/CustomHeader";
import ModalDelete from "@/components/common/ModalDelete";
import userService from "@/services/userService";
import { User } from "@/types/user";
import type { TableProps } from "antd";
import { Button, Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface DataType extends User {}

const exampleList: DataType[] = [
  {
    _id: "65976c623a26a606c0237d02",
    roles: ["User"],
    email: "user99@gmail.com",
    createdAt: "2024-01-05T02:41:38.432Z",
    updatedAt: "2024-05-31T16:58:00.500Z",
    address: "da nang",
    date_of_birth: "2006-07-11T17:00:00.000Z",
    name: "quan",
    phone: "1234",
  },
];

const baseUrl = "";

const ERROR_MESSAGE = "Error";
const USER_MANAGEMENT_ERROR = "Error ";

const TableUserPage: React.FC = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<DataType[]>(exampleList);
  const [data, setData] = useState<DataType | null>(exampleList[0]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Chức vụ",
      dataIndex: "roles",
      key: "roles",
      render: (text) => <Tag color={text?.includes("Admin") ? "magenta" : "geekblue"}>{text}</Tag>,
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
      const res = await userService.deleteUser(data?._id as string);
      if (res?.data) {
        toast.success(res?.data?.message);
        handleGetList();
      } else {
        toast.error(ERROR_MESSAGE);
      }
    } catch (error: any) {
      toast.error(error?.message || ERROR_MESSAGE);
    }
  };

  const handleAdd = () => {
    navigate(`${baseUrl}/add`);
  };

  const handleGetList = async () => {
    try {
      const res = await userService.getListUser();
      if (res?.data) {
        setList(res?.data?.data);
      } else {
        toast.error(USER_MANAGEMENT_ERROR);
      }
    } catch (error: any) {
      toast.error(error?.message || USER_MANAGEMENT_ERROR);
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
        <CustomHeader title="Quản lý người dùng">
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

export default TableUserPage;

import { ButtonDelete, ButtonEdit } from "@/components/common/CustomButtonAction";
import CustomHeader from "@/components/common/CustomHeader";
import ModalDelete from "@/components/common/ModalDelete";
import productService from "@/services/productService";
import { Product } from "@/types/product";
import { routes } from "@/utils/constant";
import { formatPrice } from "@/utils/func";
import type { TableProps } from "antd";
import { Button, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface DataType extends Product {}

const exampleList: DataType[] = [
  {
    _id: "664eb17dba8027b2d40ac79d",
    images: [
      "http://localhost:4000/images/Samsung Galaxy A24 (4G) 6GB 128GB-1.jpg",
      "http://localhost:4000/images/Samsung Galaxy A24 (4G) 6GB 128GB-2.jpg",
      "http://localhost:4000/images/Samsung Galaxy A24 (4G) 6GB 128GB-3.jpg",
      "http://localhost:4000/images/Samsung Galaxy A24 (4G) 6GB 128GB-4.jpg",
      "http://localhost:4000/images/Samsung Galaxy A24 (4G) 6GB 128GB-6.jpg",
      "http://localhost:4000/images/Samsung Galaxy A24 (4G) 6GB 128GB-7.jpg",
    ],
    price: 4090000,
    rating: 4.8,
    price_before_discount: 6490000,
    quantity: 380,
    sold: 144,
    view: 2628,
    name: "Samsung Galaxy A24 (4G) 6GB 128GB",
    category: {
      _id: "60afafe76ef5b902180aacb5",
      name: "SamSung",
    },
    description:
      "Samsung Galaxy A24 (4G) 6GB 128GB là chiếc điện thoại tầm trung mới nhất của Samsung với thiết kế màn hình Infinity-V 6.6 inch, camera chính 48 MP, pin 5000 mAh, cấu hình mạnh mẽ với RAM 6 GB, bộ nhớ trong 128 GB.",
    image: "http://localhost:4000/images/Samsung Galaxy A24 (4G) 6GB 128GB-1.jpg",
    createdAt: "2024-03-22T10:58:19.000Z",
    updatedAt: "2024-05-29T16:31:34.135Z",
  },
];

const baseUrl = routes.product;

const ERROR_MESSAGE = "Error";
const USER_MANAGEMENT_ERROR = "Error ";

const TableProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<DataType[]>(exampleList);
  const [data, setData] = useState<DataType | null>(exampleList[0]);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

  const formatData = (data: any) => {
    return data.map((item: any) => {
      return {
        _id: item?._id,
        name: item?.name,
        phone: item?.phone,
        price: item?.price,
        price_before_discount: item?.price_before_discount,
        sold: item?.sold,
        image: item?.image,
        categoryName: item?.category?.name,
        createdAt: item?.createdAt,
        updatedAt: item?.updatedAt,
      };
    });
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => (
        <div>
          <img src={text} alt="product" style={{ width: "50px", height: "50px" }} />
        </div>
      ),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (text) => <div>{text}</div>,
    },
    {
      title: "Giá gốc",
      dataIndex: "price_before_discount",
      key: "price_before_discount",
      render: (text) => <div>{formatPrice(text)}</div>,
    },
    {
      title: "Giá đã giảm",
      dataIndex: "price",
      key: "price",
      render: (text) => <div>{formatPrice(text)}</div>,
    },
    {
      title: "Đã bán",
      dataIndex: "sold",
      key: "sold",
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
      const res = await productService.deleteProduct(data?._id as string);
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
      const res = await productService.getListProduct();
      if (res?.data) {
        setList(res?.data?.data?.products);
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
        <CustomHeader title="Quản lý sản phẩm">
          <Button onClick={handleAdd} type="primary" ghost>
            Thêm mới
          </Button>
        </CustomHeader>

        <div className="pt-[30px] ">
          <Table columns={columns} dataSource={formatData(list)} />
        </div>
      </div>
    </>
  );
};

export default TableProductPage;

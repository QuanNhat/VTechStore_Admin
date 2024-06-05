import categoryService from "@/services/categoryService";
import { Category } from "@/types/category";
import { Select } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IProps {
  value?: Category;
  onChange: any;
}

const initValue = {
  _id: "",
  name: "",
};

const CustomSelectCategory: React.FC<IProps> = ({ value = initValue, onChange }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<Category[]>([initValue]);

  const handleChange = (value: string) => {
    const category = list.find((item) => item._id === value) || list[0];
    onChange({ ...category });
  };

  const handleGetList = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getListCategory();
      if (res?.data) {
        setList(res?.data?.data);
      } else {
        toast.error("Error");
      }
    } catch (error) {
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  const formatOption = (arr: Category[] | []) => {
    return arr?.map((item) => {
      return {
        value: item._id,
        label: item?.name,
      };
    });
  };

  useEffect(() => {
    handleGetList();
  }, []);

  return (
    <div className="">
      <Select
        loading={loading}
        style={{ width: "100%" }}
        placeholder="Select a category"
        optionFilterProp="children"
        onChange={handleChange}
        options={formatOption(list)}
        defaultValue={value._id}
      />
    </div>
  );
};

export default CustomSelectCategory;

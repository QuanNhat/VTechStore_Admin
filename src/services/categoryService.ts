import { SuccessResponse } from "@/types/utils";
import axiosClient from "./axiosClient";
import { Category } from "@/types/category";

const categoryService = {
  getListCategory: (): Promise<{ data: SuccessResponse<Category[]> }> => {
    return axiosClient.get(`admin/categories`);
  },
  getDetailCategory: (id: string): Promise<{ data: SuccessResponse<Category> }> => {
    return axiosClient.get(`admin/categories/${id}`);
  },
  createCategory: (data: any): Promise<{ data: any }> => {
    return axiosClient.post(`admin/categories`, data);
  },
  updateCategory: (data: any): Promise<{ data: any }> => {
    return axiosClient.put(`admin/categories/${data._id}`, data);
  },
  deleteCategory: (id: string): Promise<{ data: any }> => {
    return axiosClient.delete(`admin/categories/delete/${id}`);
  },
};

export default categoryService;

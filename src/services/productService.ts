import { SuccessResponse } from "@/types/utils";
import axiosClient from "./axiosClient";
import { Product } from "@/types/product";

const productService = {
  getListProduct: (): Promise<{
    data: SuccessResponse<{
      pagination: {
        limit: number;
        page: number;
        page_size: number;
      };
      products: Product[];
    }>;
  }> => {
    return axiosClient.get(`admin/products`);
  },
  getDetailProduct: (id: string): Promise<{ data: SuccessResponse<Product> }> => {
    return axiosClient.get(`admin/products/${id}`);
  },
  createProduct: (data: any): Promise<{ data: any }> => {
    return axiosClient.post(`admin/products`, data);
  },
  updateProduct: (data: any): Promise<{ data: any }> => {
    return axiosClient.put(`admin/products/${data._id}`, data);
  },
  deleteProduct: (id: string): Promise<{ data: any }> => {
    return axiosClient.delete(`admin/products/delete/${id}`);
  },
  uploadImage: (data: any): Promise<{ data: any }> => {
    return axiosClient.post(`admin/products/upload-image`, data);
  },
  uploadImages: (data: any): Promise<{ data: any }> => {
    return axiosClient.post(`admin/products/upload-image`, data);
  },
};

export default productService;

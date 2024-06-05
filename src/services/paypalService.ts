import { SuccessResponse } from "@/types/utils";
import axiosClient from "./axiosClient";
import { Category } from "@/types/category";

const paypalService = {
  getReport: (): Promise<{ data: SuccessResponse<Category[]> }> => {
    return axiosClient.get(`admin/categories`);
  },

};

export default paypalService;

import { User } from "@/types/user";
import { SuccessResponse } from "@/types/utils";
import axiosClient from "./axiosClient";

const userService = {
  getListUser: (): Promise<{ data: SuccessResponse<User[]> }> => {
    return axiosClient.get(`admin/users`);
  },
  getDetailUser: (id: string): Promise<{ data: SuccessResponse<User> }> => {
    return axiosClient.get(`admin/users/${id}`);
  },
  createUser: (data: any): Promise<{ data: any }> => {
    return axiosClient.post(`admin/users`, data);
  },
  updateUser: (data: any): Promise<{ data: any }> => {
    return axiosClient.put(`admin/users/${data._id}`, data);
  },
  deleteUser: (id: string): Promise<{ data: any }> => {
    return axiosClient.delete(`admin/users/delete/${id}`);
  },
};

export default userService;

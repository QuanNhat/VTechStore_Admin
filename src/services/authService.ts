import { User } from "@/types/user"
import { SuccessResponse } from "@/types/utils"
import axiosClient from "./axiosClient"

const authService = {
  login: (
    user: any
  ): Promise<{
    data: SuccessResponse<{
      access_token: string
      refresh_token: string
      user: User
    }>
  }> => {
    return axiosClient.post(`login`, user).then((response) => {
      const userData = response.data.data.user
      if (!userData.roles.includes("Admin")) {
        throw new Error("Bạn không phải là admin")
      }
      return response
    })
  },
}

export default authService

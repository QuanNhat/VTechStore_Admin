import { User } from "./user";
import { SuccessResponse } from "./utils";

export type AuthResponse = SuccessResponse<{
  access_token: string;
  refresh_token: string;
  expires_refresh_token: number;
  expires: number;
  user: User;
}>;

export type RefreshTokenReponse = SuccessResponse<{ access_token: string }>;

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export type RegisterRequest = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  roleId: number;
};

export type RegisterResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
  const response = await axios.post<RegisterResponse>(
    `${API_BASE_URL}/api/v1/auth/register`,
    request
  );
  return response.data;
}

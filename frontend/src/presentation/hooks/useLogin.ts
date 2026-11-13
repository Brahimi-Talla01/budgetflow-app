import { useState } from "react";
import axios from "axios";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (data: { email: string; password: string }) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        data
      );

      setLoading(false);

      return {
        success: true,
        message: res.data.message,
        token: res.data.access_token,
        user: res.data.user,
      };
    } catch (error: any) {
      setLoading(false);

      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.response?.data?.errors ||
          "Email ou mot de passe incorrect.",
      };
    }
  };

  return { execute, loading };
};

import { useState } from "react";
import axios from "axios";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);

  const execute = async (data: any) => {
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        data
      );

      setLoading(false);
      console.log("RESPONSE FROM HOOK:", res);


      // SUCCESS (201)
      return {
        success: true,
        message: res.data.message,
        user: res.data.user
      };
    } catch (error: any) {
      setLoading(false);

      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.response?.data?.errors ||
          "Erreur lors de l'inscription"
      };
    }
  };

  return { execute, loading };
};

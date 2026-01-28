import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const ExpenseService = {
      async getAll(token: string) {
            const res = await axios.get(`${API_URL}/expenses/`, {
                  headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
      },

      async create(token: string, data: any) {
            const res = await axios.post(`${API_URL}/expenses/`, data, {
                  headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
      },

      async update(token: string, id: number, data: any) {
            const res = await axios.put(`${API_URL}/expenses/${id}`, data, {
                  headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
      },

      async remove(token: string, id: number) {
            const res = await axios.delete(`${API_URL}/expenses/${id}`, {
                  headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
      }
};

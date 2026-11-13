import axios from "axios";
import type { CreateIncomeDTO, UpdateIncomeDTO } from "../domain/entities/Income";

const API_URL = import.meta.env.VITE_API_URL;

export interface IncomeApiResponse {
  message: string;
  income: any; 
}

export const IncomeService = {

  /* Récupérer tous les revenus */
  async getAll(token: string): Promise<any[]> {
    const res = await axios.get(`${API_URL}/incomes/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  },

  /* Récupérer un revenu par ID */
  async getById(token: string, id: number): Promise<any> {
    const res = await axios.get(`${API_URL}/incomes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  },

  /* Créer un revenu */
  async create(
    token: string,
    dto: CreateIncomeDTO
  ): Promise<IncomeApiResponse> {
    const res = await axios.post(`${API_URL}/incomes/`, dto, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  },

  /* Mettre à jour un revenu */
      async update(
            token: string,
            id: number,
            data: UpdateIncomeDTO
      ) {
            const res = await axios.put(
            `${API_URL}/income/${id}`,
            data,
            {
                  headers: { Authorization: `Bearer ${token}` },
            }
            );
            return res.data;
      },

      /* Supprimer un revenu */
      async remove(token: string, id: number): Promise<void> {
            await axios.delete(`${API_URL}/incomes/${id}`, {
                  headers: {
                        Authorization: `Bearer ${token}`,
                  },
            });
      },
};

import type { AxiosInstance } from "axios";
import type { CreateExpenseDTO, ExpenseProps } from "../../domain/entities/Expense";
import type { IExpenseRepository, UpdateExpensePayload } from "../../domain/repositories/IExpenseRepository";
import { ENDPOINTS } from "../api/endpoints";
import type { ExpenseDTO } from "../dtos/ExpenseDTO";
import { ExpenseMapper } from "../mappers/ExpenseMapper";

interface ExpenseMutationResponse {
      message: string;
      expense: ExpenseDTO;
}

export class HttpExpenseRepository implements IExpenseRepository {
      private readonly http: AxiosInstance;

      constructor(http: AxiosInstance) {
            this.http = http;
      }

      async list(): Promise<ExpenseProps[]> {
            const { data } = await this.http.get<ExpenseDTO[]>(ENDPOINTS.expenses.list);
            return data.map(ExpenseMapper.toDomain);
      }

      async create(payload: CreateExpenseDTO): Promise<ExpenseProps> {
            const { data } = await this.http.post<ExpenseMutationResponse>(
                  ENDPOINTS.expenses.list,
                  ExpenseMapper.toApi(payload)
            );
            return ExpenseMapper.toDomain(data.expense);
      }

      async update(id: number, payload: UpdateExpensePayload): Promise<ExpenseProps> {
            const { data } = await this.http.put<ExpenseMutationResponse>(ENDPOINTS.expenses.byId(id), payload);
            return ExpenseMapper.toDomain(data.expense);
      }

      async remove(id: number): Promise<void> {
            await this.http.delete(ENDPOINTS.expenses.byId(id));
      }
}

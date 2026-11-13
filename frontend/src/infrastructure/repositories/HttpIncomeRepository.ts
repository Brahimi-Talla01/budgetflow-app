import type { AxiosInstance } from "axios";
import type { CreateIncomeDTO, IncomeProps, UpdateIncomeDTO } from "../../domain/entities/Income";
import type { IIncomeRepository } from "../../domain/repositories/IIncomeRepository";
import { ENDPOINTS } from "../api/endpoints";
import type { IncomeDTO } from "../dtos/IncomeDTO";
import { IncomeMapper } from "../mappers/IncomeMapper";

interface IncomeMutationResponse {
      message: string;
      income: IncomeDTO;
}

export class HttpIncomeRepository implements IIncomeRepository {
      private readonly http: AxiosInstance;

      constructor(http: AxiosInstance) {
            this.http = http;
      }

      async list(): Promise<IncomeProps[]> {
            const { data } = await this.http.get<IncomeDTO[]>(ENDPOINTS.incomes.list);
            return data.map(IncomeMapper.toDomain);
      }

      async getById(id: number): Promise<IncomeProps> {
            const { data } = await this.http.get<IncomeDTO>(ENDPOINTS.incomes.byId(id));
            return IncomeMapper.toDomain(data);
      }

      async create(payload: CreateIncomeDTO): Promise<IncomeProps> {
            const { data } = await this.http.post<IncomeMutationResponse>(ENDPOINTS.incomes.list, payload);
            return IncomeMapper.toDomain(data.income);
      }

      async update(id: number, payload: UpdateIncomeDTO): Promise<IncomeProps> {
            const { data } = await this.http.put<IncomeMutationResponse>(ENDPOINTS.incomes.byId(id), payload);
            return IncomeMapper.toDomain(data.income);
      }

      async remove(id: number): Promise<void> {
            await this.http.delete(ENDPOINTS.incomes.byId(id));
      }
}

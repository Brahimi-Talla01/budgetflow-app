import type { CreateIncomeDTO, IncomeProps, UpdateIncomeDTO } from "../entities/Income";

export interface IIncomeRepository {
      list(): Promise<IncomeProps[]>;
      getById(id: number): Promise<IncomeProps>;
      create(payload: CreateIncomeDTO): Promise<IncomeProps>;
      update(id: number, payload: UpdateIncomeDTO): Promise<IncomeProps>;
      remove(id: number): Promise<void>;
}

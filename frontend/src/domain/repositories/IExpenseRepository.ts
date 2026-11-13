import type { CreateExpenseDTO, ExpenseProps } from "../entities/Expense";

export type UpdateExpensePayload = Partial<CreateExpenseDTO>;

export interface IExpenseRepository {
      list(): Promise<ExpenseProps[]>;
      create(payload: CreateExpenseDTO): Promise<ExpenseProps>;
      update(id: number, payload: UpdateExpensePayload): Promise<ExpenseProps>;
      remove(id: number): Promise<void>;
}
